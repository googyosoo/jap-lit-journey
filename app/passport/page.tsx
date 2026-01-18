"use client";

import { chapters } from "@/lib/data";
import { PassportStamp } from "@/components/PassportStamp";
import { useEffect, useState } from "react";
import { Map, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PassportPage() {
    const [visitedChapters, setVisitedChapters] = useState<Record<number, string>>({});

    useEffect(() => {
        // Load visited chapters from local storage
        try {
            const stored = localStorage.getItem("visitedChapters");
            if (stored) {
                setVisitedChapters(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load visited chapters", e);
        }
    }, []);

    const visitedCount = Object.keys(visitedChapters).length;
    const progress = Math.round((visitedCount / chapters.length) * 100);

    const getLevelInfo = (count: number) => {
        if (count >= 15) return { title: "문학 박사 (Master)", color: "text-sakura-600", bg: "bg-sakura-100", next: 0 };
        if (count >= 10) return { title: "일본 전문가 (Expert)", color: "text-indigo-600", bg: "bg-indigo-100", next: 15 };
        if (count >= 5) return { title: "탐험가 (Explorer)", color: "text-emerald-600", bg: "bg-emerald-100", next: 10 };
        return { title: "관광객 (Tourist)", color: "text-stone-500", bg: "bg-stone-100", next: 5 };
    };

    const level = getLevelInfo(visitedCount);

    return (
        <div className="min-h-screen bg-stone-100 font-sans pb-20">
            <header className="bg-indigo-900 text-white p-6 shadow-lg sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:text-sky-300 transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-bold">Back to Map</span>
                    </Link>
                    <h1 className="text-2xl font-bold font-serif flex items-center gap-2">
                        <Map className="text-sky-400" />
                        Travel Passport
                    </h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6">
                {/* Stats Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 border border-stone-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold text-stone-800">Journey Progress</h2>
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${level.bg} ${level.color}`}>
                                    Lv. {level.title}
                                </span>
                            </div>
                            <p className="text-stone-500">
                                {level.next > 0
                                    ? `Next Level: ${level.next - visitedCount} more cities to visit!`
                                    : "Congratulations! You have completed the journey!"}
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-indigo-900">{visitedCount}</span>
                                <span className="text-xs text-stone-500 uppercase font-bold">Visited</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-stone-300">/</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-stone-400">{chapters.length}</span>
                                <span className="text-xs text-stone-500 uppercase font-bold">Total</span>
                            </div>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-sky-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%]" />
                        </div>
                    </div>
                </div>

                {/* Stamp Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {chapters.map((chapter) => (
                        <div key={chapter.id} className="flex justify-center">
                            <PassportStamp
                                chapterId={chapter.id}
                                location={chapter.location}
                                isStamped={!!visitedChapters[chapter.id]}
                                date={visitedChapters[chapter.id]}
                            />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
