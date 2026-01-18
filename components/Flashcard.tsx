"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pattern } from "@/lib/data";
import { Volume2, Star } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

// Assuming Pattern interface is available or I'll define a compatible prop type
interface FlashcardProps {
    pattern: Pattern & { id?: string }; // Make sure ID is available for bookmarking
    chapterTitle?: string;
}

export default function Flashcard({ pattern, chapterTitle }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { speak } = useTextToSpeech();

    // Pattern ID generation if missing (fallback)
    const patternId = pattern.id || pattern.title;

    useEffect(() => {
        // Load bookmark state
        try {
            const stored = localStorage.getItem("bookmarkedPatterns");
            if (stored) {
                const bookmarks = JSON.parse(stored);
                setIsBookmarked(bookmarks.includes(patternId));
            }
        } catch (e) {
            console.error("Failed to load bookmarks", e);
        }
    }, [patternId]);

    const handleclick = () => {
        setIsFlipped(!isFlipped);
    };

    const handleSpeak = (e: React.MouseEvent) => {
        e.stopPropagation();
        const textToSpeak = (pattern.title || pattern.pattern || "").split('(')[0].trim();
        speak(textToSpeak);
    };

    const toggleBookmark = (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const stored = localStorage.getItem("bookmarkedPatterns");
            let bookmarks = stored ? JSON.parse(stored) : [];

            if (isBookmarked) {
                bookmarks = bookmarks.filter((id: string) => id !== patternId);
            } else {
                bookmarks.push(patternId);
            }

            localStorage.setItem("bookmarkedPatterns", JSON.stringify(bookmarks));
            setIsBookmarked(!isBookmarked);
        } catch (e) {
            console.error("Failed to save bookmark", e);
        }
    };

    return (
        <div className="h-64 w-full perspective-1000" onClick={handleclick}>
            <motion.div
                className="relative w-full h-full text-center transition-all duration-500 transform-style-3d cursor-pointer shadow-lg rounded-xl"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front Face */}
                <div className="absolute w-full h-full backface-hidden bg-white dark:bg-zinc-800 rounded-xl border-2 border-indigo-100 dark:border-zinc-700 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-indigo-50/30">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button
                            onClick={toggleBookmark}
                            className={`p-2 rounded-full transition-colors ${isBookmarked ? "text-yellow-400 bg-yellow-50" : "text-stone-300 hover:text-yellow-400 hover:bg-yellow-50"}`}
                        >
                            <Star className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                        </button>
                        <button
                            onClick={handleSpeak}
                            className="p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-zinc-700 text-indigo-500 transition-colors"
                        >
                            <Volume2 className="w-5 h-5" />
                        </button>
                    </div>
                    {chapterTitle && (
                        <span className="absolute top-4 left-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            {chapterTitle}
                        </span>
                    )}
                    <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
                        {pattern.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
                        Click to flip
                    </p>
                </div>

                {/* Back Face */}
                <div
                    className="absolute w-full h-full backface-hidden bg-indigo-50 dark:bg-zinc-900 rounded-xl border-2 border-indigo-200 dark:border-zinc-700 flex flex-col items-center justify-center p-6 overflow-y-auto custom-scrollbar"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <div className="text-left w-full h-full flex flex-col">
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4 bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm">
                            {pattern.description}
                        </p>

                        <div className="space-y-2 flex-1 overflow-y-auto">
                            {(pattern.examples || []).map((ex, idx) => (
                                <div key={idx} className="text-xs border-l-2 border-indigo-300 pl-2">
                                    <p className="text-indigo-700 dark:text-indigo-400 font-medium mb-0.5">{ex.japanese}</p>
                                    <p className="text-zinc-500 dark:text-zinc-500">{ex.korean}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
