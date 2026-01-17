"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Chapter } from "@/lib/data";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MapComponentProps {
    chapters: Chapter[];
}

export default function MapComponent({ chapters }: MapComponentProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [Leaflet, setLeaflet] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const L = (await import("leaflet")).default;
            // Fix Leaflet default icon issue
            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
            });
            setLeaflet(L);
            setIsMounted(true);
        })();
    }, []);

    if (!isMounted || !Leaflet) {
        return <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">Initializing Map...</div>;
    }

    const coordinates = chapters.map(c => [c.coordinates.lat, c.coordinates.lng] as [number, number]);
    const center = coordinates.length > 0 ? coordinates[0] : [35.6762, 139.6503] as [number, number];

    return (
        <MapContainer center={center} zoom={6} scrollWheelZoom={true} className="h-full w-full z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Markers */}
            {chapters.map((chapter) => (
                <Marker
                    key={chapter.id}
                    position={[chapter.coordinates.lat, chapter.coordinates.lng]}
                >
                    <Popup>
                        <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-lg text-indigo-900 mb-1">{chapter.title}</h3>
                            <p className="text-sm text-stone-600 mb-3">{chapter.description}</p>
                            <Link
                                href={`/chapter/${chapter.id}`}
                                className="inline-flex items-center gap-1 text-sm font-bold text-sakura-600 hover:text-sakura-700"
                            >
                                바로가기 <ArrowRight size={14} />
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Path connecting chapters */}
            <Polyline
                positions={coordinates}
                pathOptions={{ color: '#ec4899', weight: 4, opacity: 0.7, dashArray: '10, 10' }}
            />
        </MapContainer>
    );
}
