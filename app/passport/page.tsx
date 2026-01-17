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
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-stone-800 mb-1">Journey Progress</h2>
                            <p className="text-stone-500">Collect stamps by visiting each city!</p>
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
                    <div className="mt-6 w-full bg-stone-100 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-sky-500 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
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
