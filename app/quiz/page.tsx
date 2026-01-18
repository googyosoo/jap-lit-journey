"use client";

import { chapters } from "@/lib/data";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Trophy, RefreshCw, Home, BookOpen, Shuffle, Library, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface QuizQuestion {
    question: string;
    options: string[];
    answer: number;
    chapterTitle: string;
    explanation?: string;
}

type QuizMode = "random" | "full" | "chapter_select";

export default function GlobalQuizPage() {
    const [isStarted, setIsStarted] = useState(false);
    const [mode, setMode] = useState<QuizMode>("random");
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // Initial Start (selecting main mode)
    const selectMode = (selectedMode: QuizMode) => {
        if (selectedMode === "chapter_select") {
            setMode("chapter_select");
            // Don't start yet, show chapter grid
        } else {
            startQuiz(selectedMode);
        }
    };

    const startQuiz = (selectedMode: QuizMode, chapterId?: number) => {
        setMode(selectedMode);

        // Flatten all exercises
        const allExercises = chapters.flatMap(chapter =>
            chapter.sections.exercises.map(ex => ({
                question: ex.question,
                options: ex.options,
                answer: Number(ex.answer),
                chapterTitle: chapter.title,
                explanation: ex.explanation // Add explanation
            }))
        );

        let selectedQuestions: QuizQuestion[] = [];

        if (selectedMode === "random") {
            // Shuffle and pick 10
            const shuffled = [...allExercises].sort(() => 0.5 - Math.random());
            selectedQuestions = shuffled.slice(0, 10);
        } else if (selectedMode === "full") {
            // Full course
            selectedQuestions = allExercises;
        } else if (selectedMode === "chapter_select" && chapterId) {
            // Filter by chapter
            const targetChapter = chapters.find(c => c.id === chapterId);
            if (targetChapter) {
                selectedQuestions = targetChapter.sections.exercises.map(ex => ({
                    question: ex.question,
                    options: ex.options,
                    answer: Number(ex.answer),
                    chapterTitle: targetChapter.title,
                    explanation: ex.explanation
                }));
            }
        }

        if (selectedQuestions.length === 0) {
            alert("선택한 챕터에 문제가 없습니다.");
            return;
        }

        setQuestions(selectedQuestions);
        setCurrentIndex(0);
        setScore(0);
        setShowResult(false);
        setSelectedOption(null);
        setIsAnswered(false);
        setIsStarted(true);
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

    const restart = () => {
        setIsStarted(false);
        setShowResult(false);
        setMode("random"); // Reset to default state
    };

    // 1. Chapter Selection Screen (Sub-screen of Start)
    if (!isStarted && mode === "chapter_select") {
        return (
            <div className="min-h-screen bg-stone-50 flex flex-col items-center p-6">
                <div className="max-w-4xl w-full">
                    <button
                        onClick={() => setMode("random")}
                        className="mb-8 flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors"
                    >
                        <ArrowLeft size={20} /> 뒤로 가기
                    </button>

                    <h1 className="text-3xl font-bold font-serif text-indigo-900 mb-2">챕터 선택</h1>
                    <p className="text-stone-600 mb-8">학습할 챕터를 선택해주세요.</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {chapters.map((chapter) => (
                            <button
                                key={chapter.id}
                                onClick={() => startQuiz("chapter_select", chapter.id)}
                                className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:border-indigo-500 hover:shadow-md transition-all text-left flex flex-col h-full group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        Chapter {chapter.id}
                                    </span>
                                    <MapPin size={16} className="text-stone-300 group-hover:text-indigo-400" />
                                </div>
                                <h3 className="font-bold text-stone-800 text-lg leading-tight mb-1 group-hover:text-indigo-700">
                                    {chapter.title}
                                </h3>
                                <p className="text-sm text-stone-400 mt-auto pt-2 truncate">
                                    {chapter.location}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // 2. Start Screen (Main)
    if (!isStarted) {
        return (
            <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
                <Link href="/" className="absolute top-6 left-6 p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors">
                    <ArrowLeft size={24} />
                </Link>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-4xl w-full"
                >
                    <BookOpen className="w-20 h-20 text-indigo-900 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold font-serif text-indigo-900 mb-4">일본 문학 여행 퀴즈</h1>
                    <p className="text-stone-600 mb-12 text-lg">
                        여행하며 배운 내용을 확인해보세요.<br />
                        원하는 방식으로 학습할 수 있습니다.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Mode 1: Random */}
                        <button
                            onClick={() => selectMode("random")}
                            className="bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-indigo-400 hover:shadow-md transition-all group"
                        >
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Shuffle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 mb-2">랜덤 10문제</h3>
                            <p className="text-stone-500 text-sm">
                                전 범위에서 무작위로<br />10문제가 출제됩니다.
                            </p>
                        </button>

                        {/* Mode 2: Chapter Select */}
                        <button
                            onClick={() => selectMode("chapter_select")}
                            className="bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-emerald-400 hover:shadow-md transition-all group"
                        >
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Library size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 mb-2">챕터별 학습</h3>
                            <p className="text-stone-500 text-sm">
                                특정 챕터를 선택하여<br />집중적으로 복습합니다.
                            </p>
                        </button>

                        {/* Mode 3: Full Course */}
                        <button
                            onClick={() => selectMode("full")}
                            className="bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-sakura-400 hover:shadow-md transition-all group"
                        >
                            <div className="w-12 h-12 bg-sakura-100 text-sakura-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Trophy size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 mb-2">전체 문제 풀기</h3>
                            <p className="text-stone-500 text-sm">
                                1과부터 15과까지<br />모든 문제를 도전합니다.
                            </p>
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // 3. Result Screen
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
                    <p className="text-stone-500 mb-8">
                        {mode === "random" ? "랜덤 퀴즈 결과" : mode === "chapter_select" ? "챕터 학습 완료" : "전체 코스 완주!"}
                    </p>

                    <div className="text-6xl font-bold text-indigo-600 mb-8">
                        {score} <span className="text-2xl text-stone-400">/ {questions.length}</span>
                    </div>

                    <p className="text-lg text-stone-700 mb-8 font-serif">
                        {(score / questions.length) === 1 ? "완벽합니다! 🎉" :
                            (score / questions.length) >= 0.7 ? "훌륭해요! 👍" :
                                "조금 더 분발해 볼까요? 💪"}
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={restart}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold"
                        >
                            <RefreshCw size={20} /> 처음으로
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

    // 4. Quiz Interface
    const currentQuestion = questions[currentIndex];

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10 transition-all">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <button onClick={restart} className="p-2 hover:bg-stone-100 rounded-full text-stone-500" title="그만두기">
                        <XCircle size={24} />
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                            {mode === "random" ? "Random Quiz" : mode === "chapter_select" ? "Chapter Quiz" : "Full Course"}
                        </span>
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
            <main className="flex-1 max-w-2xl mx-auto w-full p-6 flex flex-col justify-center pb-32">
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
                                        styleClass = "bg-green-100 border-green-500 text-green-800 ring-1 ring-green-500 font-bold";
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
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "w-6 h-6 flex items-center justify-center rounded-full text-xs border border-current opacity-60",
                                                isAnswered && idx === currentQuestion.answer ? "border-green-600 text-green-700" : "text-stone-400"
                                            )}>
                                                {idx + 1}
                                            </span>
                                            <span className="font-medium text-lg">{option}</span>
                                        </div>

                                        {isAnswered && idx === currentQuestion.answer && (
                                            <CheckCircle className="text-green-600 w-6 h-6 flex-shrink-0" />
                                        )}
                                        {isAnswered && idx === selectedOption && idx !== currentQuestion.answer && (
                                            <XCircle className="text-red-500 w-6 h-6 flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation Section */}
                        {isAnswered && currentQuestion.explanation && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-6 pt-6 border-t border-stone-100"
                            >
                                <div className="flex items-start gap-3 bg-indigo-50 p-4 rounded-xl text-stone-700">
                                    <Library className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-indigo-900 mb-1">해설</p>
                                        <p className="leading-relaxed">{currentQuestion.explanation}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Next Button Area */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-stone-200 p-4 md:static md:bg-transparent md:border-0 md:p-0 md:mt-6 z-20">
                    <div className="max-w-2xl mx-auto flex items-center justify-end">
                        {isAnswered && (
                            <motion.button
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                onClick={handleNext}
                                className="w-full md:w-auto bg-indigo-900 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-indigo-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {currentIndex < questions.length - 1 ? "다음 문제" : "결과 보기"} <ArrowRight />
                            </motion.button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
