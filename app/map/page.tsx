"use client";

import { chapters } from "@/lib/data";
import dynamic from "next/dynamic";

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("../../components/MapComponent"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
            Loading Map...
        </div>
    ),
});

export default function MapPage() {
    return (
        <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-64px)] w-full relative">
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-6 py-4 rounded-xl shadow-lg border border-stone-200 max-w-sm">
                <h1 className="text-2xl font-bold font-serif text-indigo-900 mb-1">문학 지도</h1>
                <p className="text-sm text-stone-500">
                    일본 문학 기행의 전체 여정을 지도에서 확인하세요.
                    <br />마커를 클릭하면 해당 챕터로 이동할 수 있습니다.
                </p>
            </div>
            <MapComponent chapters={chapters} />
        </div>
    );
}
