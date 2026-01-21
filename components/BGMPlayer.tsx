"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Disc, Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Playlist mapping based on cities/vibes
const playlist = [
    {
        id: "tokyo",
        title: "Tokyo City Pop",
        city: "도쿄 (Tokyo)",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Placeholder: Upbeat
        keywords: ["Tokyo", "Shinjuku", "Shibuya"]
    },
    {
        id: "kyoto",
        title: "Kyoto Traditional",
        city: "교토 (Kyoto)",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", // Placeholder: Calm
        keywords: ["Kyoto", "Temple", "Shrine"]
    },
    {
        id: "osaka",
        title: "Osaka Jazz Night",
        city: "오사카 (Osaka)",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", // Placeholder: Jazzy
        keywords: ["Osaka", "Dotonbori"]
    },
    {
        id: "snow",
        title: "Snow Country Silence",
        city: "니가타 (Niigata)",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", // Placeholder: Melancholic
        keywords: ["Snow", "Niigata"]
    },
    {
        id: "okinawa",
        title: "Okinawa Breeze",
        city: "오키나와 (Okinawa)",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", // Placeholder: Tropical
        keywords: ["Okinawa", "Sea"]
    }
];

export default function BGMPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const pathname = usePathname();

    const currentTrack = playlist[currentTrackIndex];

    // Effect: Auto-switch track based on URL/Chapter?
    // For now, let's keep it manual or random start, but if user enters a chapter, we COULD switch.
    // Let's implement smart switching: if user visits /chapter/X, try to match location.
    // (Skipped for V1 to avoid annoying auto-switching, user control is better)

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(e => {
                console.log("Autoplay blocked, waiting for interaction");
                setIsPlaying(false);
            });
        } else if (!isPlaying && audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying, currentTrackIndex]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
        setIsPlaying(true);
    };

    return (
        <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-2">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-100 w-64 mb-2"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                                <Disc size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="text-sm font-bold text-stone-800 truncate">{currentTrack.title}</h3>
                                <p className="text-xs text-stone-500 truncate">{currentTrack.city}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                            <button onClick={prevTrack} className="p-2 text-stone-400 hover:text-indigo-600 transition-colors">
                                <SkipBack size={16} />
                            </button>
                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors"
                            >
                                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" ml-1 />}
                            </button>
                            <button onClick={nextTrack} className="p-2 text-stone-400 hover:text-indigo-600 transition-colors">
                                <SkipForward size={16} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsMuted(!isMuted)} className="text-stone-400 hover:text-stone-600">
                                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isMuted ? 0 : volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 border ${isPlaying
                        ? "bg-indigo-600 text-white border-indigo-500 pr-5"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    }`}
            >
                <div className={`flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
                    <Music size={20} />
                </div>
                {isPlaying && (
                    <span className="text-xs font-bold max-w-[80px] truncate">
                        {currentTrack.title}
                    </span>
                )}
            </button>

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                src={currentTrack.url}
                onEnded={nextTrack}
                loop={false}
            />
        </div>
    );
}
