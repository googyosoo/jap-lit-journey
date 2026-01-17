"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PassportStampProps {
    chapterId: number;
    location: string;
    date?: string;
    isStamped: boolean;
}

export function PassportStamp({ chapterId, location, date, isStamped }: PassportStampProps) {
    if (!isStamped) {
        return (
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-stone-200 flex flex-col items-center justify-center p-4 opacity-50 bg-stone-50">
                <span className="text-2xl font-bold text-stone-300 mb-1">{chapterId}</span>
                <span className="text-xs text-stone-300 text-center">{location}</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ scale: 2, opacity: 0, rotate: Math.random() * 40 - 20 }}
            animate={{ scale: 1, opacity: 1, rotate: Math.random() * 20 - 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={cn(
                "w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center p-4 relative mix-blend-multiply",
                "border-red-800 text-red-900 bg-red-100/10 shadow-sm backdrop-blur-[1px]",
                "mask-ink" // Hypothetical class for ink effect, or we simulate with CSS
            )}
            style={{
                borderColor: "rgba(153, 27, 27, 0.7)",
                color: "rgba(127, 29, 29, 0.9)",
            }}
        >
            <div className="absolute inset-0 rounded-full border border-red-800/30 m-1" />
            <span className="text-xs font-serif tracking-widest uppercase border-b border-red-800/50 mb-1 pb-1">Japan Journey</span>
            <span className="text-xl font-bold font-serif mb-1">{location}</span>
            <span className="text-[10px] font-mono opacity-80">{date || "VISITED"}</span>
            <span className="absolute bottom-3 text-xs font-bold">Ch. {chapterId}</span>
        </motion.div>
    );
}
