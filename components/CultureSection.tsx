import { Section } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Landmark, History, BookOpen } from "lucide-react";
import Image from "next/image";

interface CultureSectionProps {
    literature: Section;
    history: Section;
}

export default function CultureSection({ literature, history }: CultureSectionProps) {
    return (
        <div className="space-y-12">
            {/* Literature Section */}
            <section className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl overflow-hidden border border-indigo-100 shadow-sm">
                <div className="grid md:grid-cols-2 gap-0">
                    <div className="p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                                <BookOpen size={20} />
                            </span>
                            <span className="text-sm font-bold text-indigo-600 tracking-wider">LITERATURE</span>
                        </div>
                        <h2 className="text-2xl font-bold text-indigo-900 mb-4 font-serif leading-tight">
                            {literature.title}
                        </h2>
                        <div className="prose prose-stone prose-sm py-2 text-stone-600 leading-relaxed whitespace-pre-wrap">
                            {literature.content}
                        </div>
                    </div>
                    <div className="relative min-h-[300px] md:min-h-full bg-stone-200">
                        {literature.image ? (
                            <Image
                                src={literature.image}
                                alt={literature.title}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                                <BookOpen size={48} className="opacity-20" />
                            </div>
                        )}
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-l" />
                    </div>
                </div>
            </section>

            {/* History Section */}
            <section className="bg-gradient-to-br from-amber-50 to-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm">
                <div className="grid md:grid-cols-2 gap-0 md:flex-row-reverse">
                    <div className="relative min-h-[300px] md:min-h-full bg-stone-200 order-last md:order-first">
                        {history.image ? (
                            <Image
                                src={history.image}
                                alt={history.title}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                                <History size={48} className="opacity-20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r" />
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="p-2 bg-amber-100 rounded-lg text-amber-700">
                                <Landmark size={20} />
                            </span>
                            <span className="text-sm font-bold text-amber-700 tracking-wider">HISTORY</span>
                        </div>
                        <h2 className="text-2xl font-bold text-stone-800 mb-4 font-serif leading-tight">
                            {history.title}
                        </h2>
                        <div className="prose prose-stone prose-sm py-2 text-stone-600 leading-relaxed whitespace-pre-wrap">
                            {history.content}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
