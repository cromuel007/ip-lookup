import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface IpMapProps {
    latitude: number;
    longitude: number;
    ip: string;
}

function MapAnimation({
    latitude,
    longitude,
}: {
    latitude: number;
    longitude: number;
}) {
    const map = useMap();

    useEffect(() => {
        // Start zoomed out
        map.setView([latitude, longitude], 2, {
            animate: false,
        });

        // Zoom into the IP location
        const timeout = window.setTimeout(() => {
            map.flyTo([latitude, longitude], 10, {
                animate: true,
                duration: 2.5,
                easeLinearity: 0.25,
            });
        }, 300);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [map, latitude, longitude]);

    return null;
}

const markerIcon = L.divIcon({
    className: "hand-marker",
    html: `<span class="hand-marker-emoji">👇</span>`,
    iconSize: [40, 40],
    iconAnchor: [20, 36],
    popupAnchor: [0, -34],
});

function AnimatedMarker({
    latitude,
    longitude,
    ip,
}: IpMapProps) {
    const map = useMap();

    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        const markerElement = document.querySelector(
            ".ip-lookup-marker",
        ) as HTMLElement | null;

        if (!markerElement) {
            return;
        }

        markerElement.style.opacity = "0";
        markerElement.style.transformOrigin = "bottom center";
        markerElement.style.transform =
            "translateY(-100px) scale(0.5)";

        const timeout = window.setTimeout(() => {
            markerElement.style.transition =
                "transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease";

            markerElement.style.opacity = "1";
            markerElement.style.transform =
                "translateY(0) scale(1)";
        }, 2200);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [map]);

    useEffect(() => {
        const handleZoomEnd = () => {
            const marker = markerRef.current;

            if (marker) {
                marker.openPopup();
            }
        };

        map.once("zoomend", handleZoomEnd);

        return () => {
            map.off("zoomend", handleZoomEnd);
        };
    }, [map]);

    return (
        <Marker
            position={[latitude, longitude]}
            icon={markerIcon}
            zIndexOffset={1000}
            ref={(marker) => {
                markerRef.current = marker;

                if (marker) {
                    marker
                        .getElement()
                        ?.classList.add("ip-lookup-marker");
                }
            }}
        >
            <Popup>
                <div className="px-1 py-1 text-center">
                    <div className="mt-1 text-sm font-bold text-slate-900">
                        We found the suspect! 🧐
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                        {ip}
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}

export default function IpMap({
    latitude,
    longitude,
    ip,
}: IpMapProps) {
    return (
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-800">
            <MapContainer
                center={[latitude, longitude]}
                zoom={2}
                scrollWheelZoom={true}
                className="h-[550px] w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapAnimation
                    latitude={latitude}
                    longitude={longitude}
                />

                <AnimatedMarker
                    latitude={latitude}
                    longitude={longitude}
                    ip={ip}
                />
            </MapContainer>
        </div>
    );
}