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
    { name: "학습하기", href: "/chapter/1", icon: BookOpen }, // Default to Ch1 for easy access
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

            {/* Mobile Header & Menu */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md z-50 border-b border-stone-200 flex items-center justify-between px-4">
                <span className="font-serif font-bold text-lg text-indigo-900">일본어 문학기행</span>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-stone-600">
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-6"
                    >
                        <nav className="space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 p-4 text-lg border-b border-stone-100"
                                >
                                    <item.icon className="text-sakura-500" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
