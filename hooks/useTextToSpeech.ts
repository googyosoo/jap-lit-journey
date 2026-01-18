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
        // Note: Browser voice support varies wildly. Pitch/Rate is the most reliable cross-browser method.
        if (gender === "male") {
            utterance.pitch = 0.85; // Slightly deeper
            utterance.rate = 0.95;  // Slightly slower/calmer
        } else {
            utterance.pitch = 1.1;  // Slightly higher
            utterance.rate = 1.0;
        }

        // Try to select a specific voice if available
        // Google voices are common on Chrome
        const targetVoiceName = gender === "male" ? "Google 日本語" : "Google 日本語"; // Google often has one main voice, sometimes separate
        // Some systems have "Google Deutsch", "Google US English" etc.
        // For Japanese, usually "Google 日本語" is female-sounding by default or one generic voice.
        // We rely on pitch for differentiation mostly unless specific voices are known.

        // Advanced: Microsoft voices often indicate Gender (e.g. "Microsoft Ichiro" vs "Microsoft Ayumi")
        let voice = voices.find(v => v.lang === lang && v.name.includes(gender === "male" ? "Male" : "Female"));

        // Fallback checks for common JP voices
        if (!voice) {
            if (gender === "male") {
                // Try to find a male-sounding voice if possible, or just default
                voice = voices.find(v => v.lang === lang && (v.name.includes("Ichiro") || v.name.includes("Haruka"))); // Haruka is usually female, Ichiro male
            }
        }

        // Final fallback: just use the best Japanese voice
        if (!voice) {
            voice = voices.find(v => v.lang === lang && (v.name.includes("Google") || v.name.includes("Microsoft")));
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
