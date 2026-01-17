"use client";

import { chapters } from "@/lib/data";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Trophy, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface QuizQuestion {
    question: string;
    options: string[];
    answer: number;
    chapterTitle: string;
}

export default function GlobalQuizPage() {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // Initialize Quiz
    useEffect(() => {
        startQuiz();
    }, []);

    const startQuiz = () => {
        // Flatten all exercises
        const allExercises = chapters.flatMap(chapter =>
            chapter.sections.exercises.map(ex => ({
                question: ex.question,
                options: ex.options,
                answer: Number(ex.answer),
                chapterTitle: chapter.title
            }))
        );

        // Shuffle and pick 10
        const shuffled = [...allExercises].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 10));

        // Reset state
        setCurrentIndex(0);
        setScore(0);
        setShowResult(false);
        setSelectedOption(null);
        setIsAnswered(false);
    };

    const handleOptionClick = (optionIndex: number) => {
        if (isAnswered) return;

        setSelectedOption(optionIndex);
        setIsAnswered(true);

        if (optionIndex === questions[currentIndex].answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    if (questions.length === 0) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (showResult) {
        return (
            <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-10 rounded-3xl shadow-lg border border-stone-100 max-w-md w-full text-center"
                >
                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-stone-800 mb-2">Quiz Complete!</h1>
                    <p className="text-stone-500 mb-8">당신의 점수는...</p>

                    <div className="text-6xl font-bold text-indigo-600 mb-8">
                        {score} <span className="text-2xl text-stone-400">/ {questions.length}</span>
                    </div>

                    <p className="text-lg text-stone-700 mb-8 font-serif">
                        {score === 10 ? "완벽합니다! 🎉" :
                            score >= 7 ? "훌륭해요! 👍" :
                                "조금 더 분발해 볼까요? 💪"}
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={startQuiz}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold"
                        >
                            <RefreshCw size={20} /> 다시 하기
                        </button>
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-6 py-3 bg-stone-200 text-stone-700 rounded-xl hover:bg-stone-300 transition-colors font-bold"
                        >
                            <Home size={20} /> 홈으로
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <Link href="/" className="p-2 hover:bg-stone-100 rounded-full text-stone-500">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Global Quiz</span>
                        <span className="font-bold text-stone-800">Question {currentIndex + 1} / {questions.length}</span>
                    </div>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </header>

            {/* Progress Bar */}
            <div className="h-2 bg-stone-200 w-full">
                <div
                    className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            {/* Question Card */}
            <main className="flex-1 max-w-2xl mx-auto w-full p-6 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100"
                    >
                        <span className="inline-block px-3 py-1 bg-stone-100 text-stone-500 text-xs font-bold rounded-full mb-4">
                            from {currentQuestion.chapterTitle}
                        </span>

                        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-8 font-serif leading-relaxed">
                            {currentQuestion.question}
                        </h2>

                        <div className="grid gap-3">
                            {currentQuestion.options.map((option, idx) => {
                                let styleClass = "border-stone-200 hover:bg-stone-50 hover:border-stone-300";
                                if (isAnswered) {
                                    if (idx === currentQuestion.answer) {
                                        styleClass = "bg-green-100 border-green-500 text-green-800 ring-1 ring-green-500";
                                    } else if (idx === selectedOption) {
                                        styleClass = "bg-red-50 border-red-300 text-red-800";
                                    } else {
                                        styleClass = "opacity-50 border-stone-100";
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionClick(idx)}
                                        disabled={isAnswered}
                                        className={cn(
                                            "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group",
                                            styleClass
                                        )}
                                    >
                                        <span className="font-medium text-lg">{option}</span>
                                        {isAnswered && idx === currentQuestion.answer && (
                                            <CheckCircle className="text-green-600 w-6 h-6" />
                                        )}
                                        {isAnswered && idx === selectedOption && idx !== currentQuestion.answer && (
                                            <XCircle className="text-red-500 w-6 h-6" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer / Next Button */}
                <div className="h-24 flex items-center justify-center mt-6">
                    {isAnswered && (
                        <motion.button
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            onClick={handleNext}
                            className="bg-indigo-900 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-indigo-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"} <ArrowRight />
                        </motion.button>
                    )}
                </div>
            </main>
        </div>
    );
}
