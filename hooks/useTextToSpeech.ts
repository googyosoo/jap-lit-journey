"use client";

import { useState, useEffect, useCallback } from "react";

export function useTextToSpeech() {
    const [isSupported, setIsSupported] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            setIsSupported(true);

            const updateVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);
            };

            updateVoices();
            window.speechSynthesis.onvoiceschanged = updateVoices;

            return () => {
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
    }, []);

    const speak = useCallback((text: string, lang: string = "ja-JP", gender: "male" | "female" = "female", speaker?: string) => {
        if (!isSupported || !text) return;

        // Ensure voices are loaded (mobile fallback)
        let currentVoices = voices;
        if (currentVoices.length === 0 && typeof window !== "undefined") {
            currentVoices = window.speechSynthesis.getVoices();
        }

        // Android Chrome sometimes suspends synthesis; resume it.
        // Important: check if it's paused or just not speaking
        if (typeof window !== "undefined" && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }

        // Cancel any current utterance AND clear queue to preventing stacking
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        // Base settings
        let pitch = 1.0;
        let rate = 1.0;

        // Character-specific Voice Profiles
        if (speaker === "민호") {
            pitch = 0.9;
            rate = 1.0;
        } else if (speaker === "미유키") {
            pitch = 1.1;
            rate = 1.05;
        } else if (speaker === "이케야마") {
            pitch = 0.75;
            rate = 0.9;
        } else if (gender === "male") {
            pitch = 0.9;
        } else {
            pitch = 1.0;
        }

        utterance.pitch = pitch;
        utterance.rate = rate;

        // Voice Selection Logic
        let voice: SpeechSynthesisVoice | undefined;
        const normalizedLang = lang.replace("_", "-");

        // Helper to check language match (loose)
        const isLangMatch = (v: SpeechSynthesisVoice) => {
            if (!v.lang) return false;
            const vLang = v.lang.replace("_", "-");
            return vLang === normalizedLang || vLang.startsWith(normalizedLang.split("-")[0]);
        };

        const availableVoices = currentVoices.filter(isLangMatch);

        // 1. Try to assign specific voices to specific characters if multiple voices exist
        if (availableVoices.length > 0) {
            // Check for known quality voices (iOS: Kyoko, Otoya; Android: Google)
            const maleVoices = availableVoices.filter(v =>
                v.name.includes("Ichiro") || v.name.includes("Male") || v.name.includes("Hattori") || v.name.includes("Otoya")
            );
            const femaleVoices = availableVoices.filter(v =>
                v.name.includes("Ayumi") || v.name.includes("Haruka") || v.name.includes("Female") || v.name.includes("Kyoko") || v.name.includes("Google")
            );

            // Simple hash function to get consistent index from string
            const getHashIndex = (str: string, max: number) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash);
                }
                return Math.abs(hash) % max;
            };

            if (gender === "male") {
                if (maleVoices.length > 0) {
                    if (speaker) {
                        const index = getHashIndex(speaker, maleVoices.length);
                        voice = maleVoices[index];
                    } else {
                        voice = maleVoices[0];
                    }
                } else {
                    voice = availableVoices.find(v => !v.name.includes("Female") && !v.name.includes("Ayumi") && !v.name.includes("Kyoko"));
                }
            } else {
                if (femaleVoices.length > 0) {
                    if (speaker) {
                        const index = getHashIndex(speaker, femaleVoices.length);
                        voice = femaleVoices[index];
                    } else {
                        voice = femaleVoices[0];
                    }
                }
            }
        }

        // 2. Generic Fallback
        if (!voice && availableVoices.length > 0) {
            voice = availableVoices[0];
        }

        // 3. Fallback
        if (voice) {
            utterance.voice = voice;
        }

        // GC Fix: Keep reference to utterance
        // @ts-ignore
        window.utterances = window.utterances || [];
        // @ts-ignore
        window.utterances.push(utterance);

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => {
            setIsPlaying(false);
            // Clean up reference
            // @ts-ignore
            if (window.utterances) {
                // @ts-ignore
                const idx = window.utterances.indexOf(utterance);
                // @ts-ignore
                if (idx > -1) window.utterances.splice(idx, 1);
            }
        };
        utterance.onerror = (e) => {
            console.error("TTS Error:", e);
            setIsPlaying(false);
            // @ts-ignore
            if (window.utterances) {
                // @ts-ignore
                const idx = window.utterances.indexOf(utterance);
                // @ts-ignore
                if (idx > -1) window.utterances.splice(idx, 1);
            }
        };

        window.speechSynthesis.speak(utterance);
    }, [isSupported, voices]);

    const stop = useCallback(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        }
    }, []);

    return { speak, stop, isPlaying, isSupported };
}
