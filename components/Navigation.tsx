"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Map, BookOpen, Home, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { name: "홈", href: "/", icon: Home },
    { name: "문학 지도", href: "/map", icon: Map },
    { name: "학습하기", href: "/quiz", icon: BookOpen },
];

export default function Navigation() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-md border-r border-stone-200 shadow-sm h-full z-50">
                <div className="p-6">
                    <h1 className="text-2xl font-bold font-serif text-indigo-900 tracking-wide">
                        일본어<br />문학기행
                    </h1>
                    <p className="text-xs text-stone-500 mt-2 tracking-widest uppercase">Japanese Literature Journey</p>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                                    isActive
                                        ? "bg-sakura-500/10 text-sakura-700 font-medium shadow-sm ring-1 ring-sakura-500/20"
                                        : "text-stone-600 hover:bg-stone-100 hover:text-indigo-900"
                                )}
                            >
                                <item.icon size={20} className={cn(isActive ? "text-sakura-700" : "text-stone-400")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-6 border-t border-stone-100">
                    <div className="text-xs text-stone-400 text-center">
                        Designed for JLPT & Culture
                    </div>
                </div>
            </aside>

            {/* Mobile Top Bar (Title Only) */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-30 border-b border-stone-200 pt-safe">
                <div className="flex items-center justify-center h-14 px-4">
                    <span className="font-serif font-bold text-lg text-indigo-900">일본어 문학기행</span>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50 pb-safe">
                <div className="flex justify-around items-center h-16">
                    <Link
                        href="/"
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1",
                            pathname === "/" ? "text-sakura-600" : "text-stone-400 hover:text-stone-600"
                        )}
                    >
                        <Home size={24} strokeWidth={pathname === "/" ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">홈</span>
                    </Link>
                    <Link
                        href="/map"
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1",
                            pathname === "/map" ? "text-indigo-600" : "text-stone-400 hover:text-stone-600"
                        )}
                    >
                        <Map size={24} strokeWidth={pathname === "/map" ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">문학지도</span>
                    </Link>
                    <Link
                        href="/quiz"
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1",
                            pathname.startsWith("/quiz") ? "text-emerald-600" : "text-stone-400 hover:text-stone-600"
                        )}
                    >
                        <BookOpen size={24} strokeWidth={pathname.startsWith("/quiz") ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">퀴즈</span>
                    </Link>
                    {/* Passport Link - Added for easy access */}
                    <Link
                        href="/passport"
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1",
                            pathname === "/passport" ? "text-orange-600" : "text-stone-400 hover:text-stone-600"
                        )}
                    >
                        {/* Using a custom icon or generic one for Passport if not imported, reusing Map for now or importing new one if needed.
                            Wait, I can add `Book` or `Stamp` icon. Let's use `Stamp` if available or `Award`?
                            Checking imports: `Map, BookOpen, Home, Menu, X` are imported.
                            I should check what icons are available or use one of existing.
                            Actually `PassportPage` uses `Map` icon in header.
                            Let's add `User` or `Award` or `Sticker` icon?
                            I will stick to `BookOpen` variant or similar.
                            Actually let's use `Trophy` for quiz and `User` or `CreditCard` (looks like passport)?
                            Let's import `CreditCard` or `Stamp` from lucide-react.
                            Wait, I need to update imports first.
                        */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={pathname === "/passport" ? "2.5" : "2"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width="16" height="22" x="4" y="2" rx="2" />
                            <circle cx="12" cy="14" r="5" />
                        </svg>
                        <span className="text-[10px] font-bold">여권</span>
                    </Link>
                </div>
            </nav>
        </>
    );
}
