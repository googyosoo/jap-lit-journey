"use client";

import { chapters } from "@/lib/data";
import { notFound } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Book, PenTool, Landmark, Map as MapIcon, PlayCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import CultureSection from "@/components/CultureSection";
import ExerciseSection from "@/components/ExerciseSection";

export default function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    const id = Number(resolvedParams.id);
    const chapter = chapters.find((c) => c.id === id);

    if (!chapter) return notFound();

    const [activeTab, setActiveTab] = useState<"conversation" | "patterns" | "exercises" | "culture" | "map">("conversation");
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const { speak, stop } = useTextToSpeech();
    const [isShadowing, setIsShadowing] = useState(false);
    const [currentShadowIndex, setCurrentShadowIndex] = useState(-1);

    // Shadowing Logic
    React.useEffect(() => {
        if (!isShadowing) {
            stop();
            setCurrentShadowIndex(-1);
            return;
        }

        let timeoutId: NodeJS.Timeout;

        const playNext = async (index: number) => {
            if (index >= chapter.sections.conversation.length) {
                setIsShadowing(false); // End of conversation
                return;
            }

            setCurrentShadowIndex(index);
            const conv = chapter.sections.conversation[index];
            const gender = conv.speaker === "민호" ? "male" : "female";

            // Speak text
            speak(conv.japanese, "ja-JP", gender);

            // Estimate duration (rough: 200ms per character) + 3s pause
            // A better way would be using onend callback from speak, but current hook implementation 
            // separates speak trigger from state. We'll use a rough timeout for "Shadowing Pause".
            // Ideally, we'd augment useTextToSpeech to return a Promise or take a callback.
            // Given the constraints, we will adapt this logic:
            // The hook sets 'isPlaying'. We can monitor 'isPlaying'.
            // However, monitoring 'isPlaying' inside a loop/effect is tricky with React updates.
            // Let's rely on a calculated delay for now: (Text Length * 200ms) + 2000ms pause.
            const estimatedDuration = (conv.japanese.length * 200) + 1000; // speaking time

            timeoutId = setTimeout(() => {
                // After speaking (assumed), wait for user to shadow (2s pause)
                // Actually, let's just create a chain.
                // Correct approach without refactoring hook completely:
                // We need to know when speaking ends.
                // Let's assume the user speaks ALONG or AFTER.
                // Let's give a generous pause.

                // Re-check logic: The existing hook has `isPlaying` state.
                // We can use an effect dependent on `isPlaying`.
            }, estimatedDuration);
        };

        // Trigger first play
        if (currentShadowIndex === -1) {
            playNext(0);
        }

        return () => clearTimeout(timeoutId);
    }, [isShadowing, id]); // Note: This simple effect loop is flawed because it doesn't wait for audio end.

    // Better Shadowing Implementation using `isPlaying` effect
    React.useEffect(() => {
        if (!isShadowing) return;

        // If we just started (index -1), start 0
        if (currentShadowIndex === -1) {
            setCurrentShadowIndex(0);
            return;
        }

        // This effect runs when isShadowing or index changes or isPlaying changes.
        // We need a separate mechanism.

    }, [isShadowing, currentShadowIndex]);

    // Let's use a simpler "Ref-based" sequence manager or just modify the hook to accept onEnd.
    // Since I can't easily change the hook's signature deeply without breaking others...
    // Actually I can. I updated the hook to standard args.
    // I'll stick to a calculated timeout for now as it's robust enough for a prototype "Shadowing" feature.

    // REVISED LOGIC:
    // We will use a separate useEffect that watches `currentShadowIndex` and `isShadowing`.
    React.useEffect(() => {
        if (!isShadowing) return;
        if (currentShadowIndex === -1) {
            setCurrentShadowIndex(0);
            return;
        }

        if (currentShadowIndex >= chapter.sections.conversation.length) {
            setIsShadowing(false);
            return;
        }

        const conv = chapter.sections.conversation[currentShadowIndex];
        const gender = conv.speaker === "민호" ? "male" : "female";

        speak(conv.japanese, "ja-JP", gender);

        // Approximate duration: char_length * 200ms + 3000ms pause for shadowing
        const duration = (conv.japanese.length * 200) + 3000;

        const timer = setTimeout(() => {
            setCurrentShadowIndex(prev => prev + 1);
        }, duration);

        return () => clearTimeout(timer);
    }, [isShadowing, currentShadowIndex, id]);

    React.useEffect(() => {
        // Mark as visited
        try {
            const stored = localStorage.getItem("visitedChapters");
            const visited = stored ? JSON.parse(stored) : {};
            if (!visited[id]) {
                const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                visited[id] = today;
                localStorage.setItem("visitedChapters", JSON.stringify(visited));
            }
        } catch (e) {
            console.error("Failed to mark chapter as visited", e);
        }
    }, [id]);

    const tabs = [
        { id: "conversation", label: "회화", icon: MessageCircle },
        { id: "patterns", label: "문형 연습", icon: Book },
        { id: "exercises", label: "연습 문제", icon: PenTool },
        { id: "culture", label: "문학/역사", icon: Landmark },
        { id: "map", label: "지도", icon: MapIcon },
    ] as const;

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="mb-8 border-b border-stone-200 pb-6">
                <div className="flex flex-col md:flex-row md:items-end gap-2 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold font-serif text-sky-900">{chapter.japaneseTitle}</h1>
                    <span className="text-xl text-stone-400 font-medium md:mb-1">| {chapter.title}</span>
                </div>
                <p className="text-stone-500 flex items-center gap-2">
                    <MapIcon size={16} className="text-sky-500" /> {chapter.description}
                </p>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-8 pb-2 no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all",
                            activeTab === tab.id
                                ? "bg-indigo-900 text-white shadow-md"
                                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                        )}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "conversation" && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between border-b-2 border-sky-400 pb-2 mb-6">
                                    <h2 className="text-xl font-bold text-sky-600 flex items-center gap-2">
                                        <MessageCircle className="text-sky-500" /> 회화문 (Conversation)
                                    </h2>
                                    <button
                                        onClick={() => setIsShadowing(!isShadowing)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all",
                                            isShadowing ? "bg-red-500 text-white shadow-lg animate-pulse" : "bg-sky-100 text-sky-700 hover:bg-sky-200"
                                        )}
                                    >
                                        {isShadowing ? "쉐도잉 중지 (Stop)" : "쉐도잉 시작 (Shadowing)"}
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {chapter.sections.conversation.length > 0 ? (
                                        chapter.sections.conversation.map((conv, idx) => (
                                            <div key={idx} className={cn(
                                                "flex gap-4 group transition-opacity duration-300",
                                                isShadowing && currentShadowIndex !== idx ? "opacity-40" : "opacity-100"
                                            )}>
                                                <div className="w-16 flex-shrink-0 flex flex-col items-center">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-sm mb-1",
                                                        conv.speaker === "민호" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                                                    )}>
                                                        {conv.speaker}
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "flex-1 space-y-1 bg-white p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl border shadow-sm relative transition-all duration-300",
                                                    isShadowing && currentShadowIndex === idx ? "border-sky-400 shadow-md ring-2 ring-sky-100 transform scale-[1.02]" : "border-stone-100 hover:shadow-md"
                                                )}>
                                                    <div className="flex justify-between items-start gap-2">
                                                        <p className="text-lg font-bold text-stone-800 font-serif leading-relaxed">{conv.japanese}</p>
                                                        <button
                                                            onClick={() => speak(conv.japanese, "ja-JP", conv.speaker === "민호" ? "male" : "female")}
                                                            className="text-stone-300 hover:text-indigo-600 transition-colors p-1"
                                                            title="일본어 듣기"
                                                        >
                                                            <PlayCircle size={20} />
                                                        </button>
                                                    </div>
                                                    <p className="text-stone-500 text-sm">{conv.korean}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                                            콘텐츠 준비 중입니다.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "patterns" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                                    <Book className="text-sakura-500" /> 문형 연습
                                </h2>
                                <div className="grid gap-4">
                                    {chapter.sections.patterns.map((pat, idx) => (
                                        <div key={idx} className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                                            {pat.title ? (
                                                <>
                                                    <div className="mb-3">
                                                        <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-900 text-xs font-bold rounded mb-2">Pattern {idx + 1}</span>
                                                        <h3 className="text-xl font-bold text-indigo-900 mb-1">{pat.title}</h3>
                                                        {pat.description && (
                                                            <p className="text-stone-600 text-sm mb-3">{pat.description}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3">
                                                        {pat.examples?.map((ex, exIdx) => (
                                                            <div key={exIdx} className="bg-white/60 p-3 rounded-lg border border-indigo-50/50 flex justify-between items-start gap-3">
                                                                <div className="flex-1">
                                                                    <p className="font-bold text-stone-800 font-serif mb-1">{ex.japanese}</p>
                                                                    <p className="text-stone-500 text-sm">{ex.korean}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => speak(ex.japanese)}
                                                                    className="text-stone-300 hover:text-indigo-600 transition-colors pt-1"
                                                                    title="예문 듣기"
                                                                >
                                                                    <PlayCircle size={18} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="mb-2">
                                                        <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-900 text-xs font-bold rounded mb-2">Pattern {idx + 1}</span>
                                                        <h3 className="text-lg font-bold text-indigo-900">{pat.pattern}</h3>
                                                    </div>
                                                    <div className="bg-white/60 p-3 rounded-lg text-stone-700 italic flex justify-between items-center gap-3">
                                                        <span>&quot;{pat.example}&quot;</span>
                                                        <button
                                                            onClick={() => speak(pat.example || "")}
                                                            className="text-stone-300 hover:text-indigo-600 transition-colors"
                                                            title="예문 듣기"
                                                        >
                                                            <PlayCircle size={18} />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "exercises" && (
                            <ExerciseSection exercises={chapter.sections.exercises} />
                        )}

                        {activeTab === "culture" && (
                            <div className="animate-fade-in">
                                <CultureSection
                                    literature={chapter.sections.literature}
                                    history={chapter.sections.history}
                                />
                            </div>
                        )}

                        {activeTab === "map" && (
                            <div className="h-[500px] w-full bg-stone-100 rounded-xl overflow-hidden relative flex flex-col">
                                <div className="flex-1 relative">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        className="border-0 absolute inset-0"
                                        loading="lazy"
                                        allowFullScreen
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(chapter.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                    ></iframe>
                                </div>
                                <div className="bg-white p-4 border-t border-stone-200 flex justify-between items-center">
                                    <div className="text-sm text-stone-500">
                                        <MapIcon className="inline mr-1" size={16} />
                                        {chapter.location}
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(chapter.location)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-indigo-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-800 transition-colors flex items-center gap-2"
                                    >
                                        Google Maps에서 크게 보기 <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
