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
        if (!isSupported) return;

        // Cancel any current utterance
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        // Gender-based adjustments
        // Gender-based adjustments
        if (gender === "male") {
            utterance.pitch = 0.9;
            utterance.rate = 1.0;
        } else {
            utterance.pitch = 1.0;
            utterance.rate = 1.0;
        }

        // Voice Selection Logic
        let voice: SpeechSynthesisVoice | undefined;

        // 1. Try to find a voice that matches the language and gender specifically
        if (gender === "male") {
            // Prioritize known male Japanese voices
            voice = voices.find(v => v.lang === lang && (v.name.includes("Ichiro") || v.name.includes("Male")));
        } else {
            // Prioritize known female Japanese voices
            voice = voices.find(v => v.lang === lang && (v.name.includes("Ayumi") || v.name.includes("Haruka") || v.name.includes("Female")));
        }

        // 2. If no gender-specific voice found, try Google's Japanese voice (usually female/neutral)
        if (!voice && lang === "ja-JP") {
            voice = voices.find(v => v.name.includes("Google 日本語"));
        }

        // 3. Fallback: just use any voice for that language
        if (!voice) {
            voice = voices.find(v => v.lang === lang);
        }

        if (voice) {
            utterance.voice = voice;
        }

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
    }, [isSupported, voices]);

    const stop = useCallback(() => {
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    }, [isSupported]);

    return { speak, stop, isPlaying, isSupported };
}
