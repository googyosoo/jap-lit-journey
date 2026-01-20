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

    const speak = useCallback((text: string, lang: string = "ja-JP", gender: "male" | "female" = "female") => {
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

        // Gender-based adjustments (Pitch/Rate)
        if (gender === "male") {
            utterance.pitch = 0.9;
            utterance.rate = 1.0;
        } else {
            utterance.pitch = 1.0;
            utterance.rate = 1.0;
        }

        // Voice Selection Logic
        let voice: SpeechSynthesisVoice | undefined;
        const normalizedLang = lang.replace("_", "-");

        // Helper to check language match (loose)
        const isLangMatch = (v: SpeechSynthesisVoice) => {
            const vLang = v.lang.replace("_", "-");
            return vLang === normalizedLang || vLang.startsWith(normalizedLang.split("-")[0]);
        };

        // 1. Try to find a voice that matches the language and gender keywords
        if (gender === "male") {
            voice = currentVoices.find(v => isLangMatch(v) && (v.name.includes("Ichiro") || v.name.includes("Male") || v.name.includes("Hattori")));
        } else {
            voice = currentVoices.find(v => isLangMatch(v) && (v.name.includes("Ayumi") || v.name.includes("Haruka") || v.name.includes("Female") || v.name.includes("Kyoko")));
        }

        // 2. If no gender-specific voice found, try Google's Japanese voice
        if (!voice && normalizedLang.startsWith("ja")) {
            voice = currentVoices.find(v => v.name.includes("Google 日本語"));
        }

        // 3. Fallback: just use any voice for that language
        if (!voice) {
            voice = currentVoices.find(v => isLangMatch(v));
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
