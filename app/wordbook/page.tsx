"use client";

import { chapters } from "@/lib/data";
import Flashcard from "@/components/Flashcard";
import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function WordbookPage() {
    const [searchTerm, setSearchTerm] = useState("");

    // Flatten all patterns into a single array with chapter info
    const allPatterns = chapters.flatMap(chapter =>
        chapter.sections.patterns.map((pattern, index) => ({
            ...pattern,
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            japaneseTitle: chapter.japaneseTitle,
            id: `${chapter.id}-${index}`
        }))
    );

    const filteredPatterns = allPatterns.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.examples?.some(e =>
            e.japanese.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.korean.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            <div className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/" className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6 text-stone-600" />
                        </Link>
                        <h1 className="text-2xl font-bold font-serif text-indigo-900 flex items-center gap-2">
                            <BookOpen className="text-indigo-600" /> 단어장 (Wordbook)
                        </h1>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="단어, 뜻, 예문 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-stone-500 font-medium">
                        총 <span className="text-indigo-600 font-bold">{filteredPatterns.length}</span>개의 문형이 있습니다.
                    </p>
                </div>

                {filteredPatterns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPatterns.map((pattern) => (
                            <div key={pattern.id}>
                                <Flashcard
                                    pattern={pattern}
                                    chapterTitle={`${pattern.chapterTitle} (${pattern.japaneseTitle})`}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-stone-400 text-lg">검색 결과가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
