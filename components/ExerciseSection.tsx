"use client";

import { useState } from "react";
import { PenTool, CheckCircle2, XCircle, HelpCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Exercise {
    question: string;
    options: string[];
    answer: number | string;
    explanation?: string;
}

interface ExerciseSectionProps {
    exercises: Exercise[];
}

export default function ExerciseSection({ exercises }: ExerciseSectionProps) {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});

    const handleOptionSelect = (questionIdx: number, optionIdx: number) => {
        if (answers[questionIdx] !== undefined) return; // Prevent changing answer

        setAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
        // Auto-show explanation immediately after answering
        setShowExplanations(prev => ({ ...prev, [questionIdx]: true }));
    };

    const resetExercises = () => {
        if (window.confirm("모든 문제의 정답 기록을 초기화하시겠습니까?")) {
            setAnswers({});
            setShowExplanations({});
        }
    };

    const correctCount = exercises.filter((ex, idx) => answers[idx] === ex.answer).length;
    const progress = Math.round((Object.keys(answers).length / exercises.length) * 100);

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-10 backdrop-blur-sm bg-white/90">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
                        <PenTool size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-indigo-900">연습 문제</h2>
                        <p className="text-stone-500 text-sm">총 {exercises.length}문항 중 {Object.keys(answers).length}문항 풀이</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="flex-1 md:w-48">
                        <div className="flex justify-between text-xs font-bold mb-1 text-stone-500">
                            <span>진행률</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="text-right min-w-[80px]">
                        <span className="block text-xs text-stone-400 font-bold uppercase tracking-wider">Score</span>
                        <span className="text-2xl font-bold text-indigo-600 font-mono">
                            {correctCount}<span className="text-stone-300 text-lg">/{exercises.length}</span>
                        </span>
                    </div>

                    <button
                        onClick={resetExercises}
                        className="p-2 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        title="초기화"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {exercises.map((ex, idx) => {
                    const isAnswered = answers[idx] !== undefined;
                    const selected = answers[idx];
                    const isCorrect = selected === ex.answer;

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={cn(
                                "bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300",
                                isAnswered
                                    ? (isCorrect ? "border-green-100 shadow-sm" : "border-red-100 shadow-sm")
                                    : "border-stone-100 hover:border-indigo-200 hover:shadow-md"
                            )}
                        >
                            {/* Question Number & Status Header */}
                            <div className={cn(
                                "px-6 py-3 text-xs font-bold flex justify-between items-center border-b",
                                isAnswered
                                    ? (isCorrect ? "bg-green-50/50 text-green-700 border-green-50" : "bg-red-50/50 text-red-700 border-red-50")
                                    : "bg-stone-50 text-stone-500 border-stone-100"
                            )}>
                                <span>QUESTION {idx + 1}</span>
                                {isAnswered && (
                                    <span className="flex items-center gap-1">
                                        {isCorrect ? (
                                            <>정답입니다! <CheckCircle2 size={14} /></>
                                        ) : (
                                            <>오답입니다 <XCircle size={14} /></>
                                        )}
                                    </span>
                                )}
                            </div>

                            <div className="p-6 md:p-8">
                                <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-6 leading-relaxed font-serif">
                                    {ex.question.split('\n').map((line, i) => (
                                        <span key={i} className="block mb-1">{line}</span>
                                    ))}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                    {ex.options.map((opt, optIdx) => {
                                        const isSelected = selected === optIdx;
                                        const isThisCorrect = optIdx === ex.answer;

                                        let baseStyle = "relative p-4 rounded-xl text-left border-2 transition-all duration-200 text-sm md:text-base font-medium";
                                        let statusStyle = "border-stone-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 text-stone-600";

                                        if (isAnswered) {
                                            if (isThisCorrect) {
                                                statusStyle = "border-green-500 bg-green-50 text-green-800 shadow-inner";
                                            } else if (isSelected && !isCorrect) {
                                                statusStyle = "border-red-400 bg-red-50 text-red-800 opacity-80";
                                            } else {
                                                statusStyle = "border-transparent bg-stone-50 text-stone-400 opacity-50";
                                            }
                                        }

                                        return (
                                            <button
                                                key={optIdx}
                                                onClick={() => handleOptionSelect(idx, optIdx)}
                                                disabled={isAnswered}
                                                className={cn(baseStyle, statusStyle)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className={cn(
                                                        "flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border",
                                                        isAnswered && isThisCorrect ? "bg-green-600 border-green-600 text-white" :
                                                            isAnswered && isSelected && !isCorrect ? "bg-red-500 border-red-500 text-white" :
                                                                "bg-white border-stone-300 text-stone-400"
                                                    )}>
                                                        {optIdx + 1}
                                                    </span>
                                                    <span>{opt}</span>
                                                </div>

                                                {isAnswered && isThisCorrect && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 animate-scale-in">
                                                        <CheckCircle2 size={20} />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <AnimatePresence>
                                    {isAnswered && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                                                <div className="flex items-start gap-3">
                                                    <HelpCircle className="text-indigo-500 flex-shrink-0 mt-0.5" size={20} />
                                                    <div>
                                                        <h4 className="font-bold text-indigo-900 text-sm mb-1">해설</h4>
                                                        <p className="text-stone-700 text-sm leading-relaxed">
                                                            {ex.explanation || (
                                                                <span className="text-stone-400 italic">해설이 준비 중입니다.</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
