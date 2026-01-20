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

        // Ensure voices are loaded (fallback for some browsers)
        let currentVoices = voices;
        if (currentVoices.length === 0 && typeof window !== "undefined") {
            currentVoices = window.speechSynthesis.getVoices();
        }

        // Cancel any current utterance
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
            pitch = 1.1; // Slightly higher
            rate = 1.05; // Slightly faster (energetic)
        } else if (speaker === "이케야마") {
            pitch = 0.75; // Deeper voice
            rate = 0.9; // Slower, more deliberate
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
            const vLang = v.lang.replace("_", "-");
            return vLang === normalizedLang || vLang.startsWith(normalizedLang.split("-")[0]);
        };

        const availableVoices = currentVoices.filter(isLangMatch);

        // 1. Try to assign specific voices to specific characters if multiple voices exist
        if (availableVoices.length > 0) {
            // Check for known quality voices
            const maleVoices = availableVoices.filter(v => v.name.includes("Ichiro") || v.name.includes("Male") || v.name.includes("Hattori"));
            const femaleVoices = availableVoices.filter(v => v.name.includes("Ayumi") || v.name.includes("Haruka") || v.name.includes("Female") || v.name.includes("Kyoko") || v.name.includes("Google"));

            if (gender === "male") {
                if (maleVoices.length > 0) {
                    // If multiple male voices, try to give different ones
                    if (speaker === "이케야마" && maleVoices.length > 1) {
                        voice = maleVoices[1]; // Second male voice for Ikeyama
                    } else {
                        voice = maleVoices[0];
                    }
                } else {
                    // Fallback to any voice if no specific male voice
                    voice = availableVoices.find(v => !v.name.includes("Female") && !v.name.includes("Ayumi") && !v.name.includes("Haruka"));
                }
            } else {
                if (femaleVoices.length > 0) {
                    voice = femaleVoices[0];
                }
            }
        }

        // 2. Generic Fallback
        if (!voice) {
            voice = availableVoices[0];
        }

        if (voice) {
            utterance.voice = voice;
        }

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = (e) => {
            console.error("TTS Error:", e);
            setIsPlaying(false);
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
