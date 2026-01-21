"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Disc, Volume2, VolumeX, Play, Pause, X, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Playlist mapping based on actual app chapters
const playlist = [
    {
        id: "tokyo",
        title: "Tokyo Breeze",
        city: "도쿄 (Tokyo)",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        color: "bg-indigo-500"
    },
    {
        id: "kyoto",
        title: "Old Kyoto",
        city: "교토 (Kyoto)",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        color: "bg-sakura-500"
    },
    {
        id: "osaka",
        title: "Osaka Jazz",
        city: "오사카 (Osaka)",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        color: "bg-orange-500"
    },
    {
        id: "hiroshima",
        title: "Peaceful River",
        city: "히로시마 (Hiroshima)",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
        color: "bg-teal-500"
    },
    {
        id: "nagasaki",
        title: "Port Hill",
        city: "나가사키 (Nagasaki)",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        color: "bg-blue-500"
    }
];

export default function BGMPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [volume, setVolume] = useState(0.4);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentTrack = playlist[currentTrackIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Playback prevented:", error);
                    setIsPlaying(false);
                });
            }
        } else if (!isPlaying && audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying, currentTrackIndex]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const selectTrack = (index: number) => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
    };

    return (
        <div className="fixed bottom-24 right-4 z-[100] flex flex-col items-end gap-2">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-stone-200 w-72 origin-bottom-right"
                    >
                        <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-2">
                            <h3 className="font-bold text-stone-800 flex items-center gap-2">
                                <MapPin size={16} className="text-indigo-500" />
                                도시 선택 (City BGM)
                            </h3>
                            <button onClick={() => setIsExpanded(false)} className="text-stone-400 hover:text-stone-600">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                            {playlist.map((track, idx) => (
                                <button
                                    key={track.id}
                                    onClick={() => selectTrack(idx)}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between group ${currentTrackIndex === idx
                                            ? "bg-indigo-50 text-indigo-900 font-bold border border-indigo-100"
                                            : "hover:bg-stone-50 text-stone-600"
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${track.color}`}></span>
                                        {track.city}
                                    </span>
                                    {currentTrackIndex === idx && isPlaying && (
                                        <span className="flex gap-0.5 h-3 items-end">
                                            <span className="w-0.5 bg-indigo-500 animate-[music-bar_0.5s_ease-in-out_infinite] h-2"></span>
                                            <span className="w-0.5 bg-indigo-500 animate-[music-bar_0.7s_ease-in-out_infinite] h-3"></span>
                                            <span className="w-0.5 bg-indigo-500 animate-[music-bar_0.6s_ease-in-out_infinite] h-1"></span>
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-3">
                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 rounded-full bg-indigo-600 text-white flex-shrink-0 flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
                            >
                                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" ml-1 />}
                            </button>

                            <div className="flex-1">
                                <div className="text-xs font-bold text-stone-800 truncate mb-1">
                                    {currentTrack.title}
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
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 border backdrop-blur-sm ${isPlaying
                        ? "bg-indigo-600/90 text-white border-indigo-500 pr-5"
                        : "bg-white/90 text-stone-600 border-stone-200 hover:bg-white"
                    }`}
            >
                <div className={`flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
                    <Music size={20} />
                </div>
                {isPlaying && (
                    <span className="text-xs font-bold max-w-[80px] truncate">
                        {currentTrack.city.split(" ")[0]}
                    </span>
                )}
            </button>

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                src={currentTrack.url}
                loop={true}
                playsInline
                onError={(e) => console.error("Audio playback error:", e)}
            />
        </div>
    );
}
