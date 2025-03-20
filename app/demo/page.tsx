'use client';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import {useEffect, useState} from 'react';
import CitySelector from "../components/citySelector";
import dynamic from "next/dynamic";

// Disable SSR for MapDisplay
const MapDisplay = dynamic(() => import("../components/mapDisplay"), { ssr: false });

export default function Page() {
    const [selectedCity, setSelectedCity] = useState<{ name: string; lat: number; lon: number } | null>(null);
    const [clue, setClue] = useState<string>('');
    const [gameLoaded, setLoaded] = useState(false);
    const [difficulty, setDifficulty] = useState<"easy"|"medium"|"hard">("easy");
    const [timeLeft, setTimeLeft] = useState(120);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("leaflet").then((L) => {
                L.Icon.Default.mergeOptions({
                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                });
            });
        }
        const playerDifficulty = localStorage.getItem("difficulty") as "easy"|"medium"|"hard";
        if (playerDifficulty) {
            setDifficulty(playerDifficulty);
            if (playerDifficulty === "medium"){
                setTimeLeft(120);
            }
            if (playerDifficulty === "hard"){
                setTimeLeft(120);
            }
        }
    }, []);

    useEffect(() => {
        if (gameLoaded && difficulty !== "easy" && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }

        if (timeLeft === 0) {
            setGameOver(true);
            setClue("Time's up! The killer got away");
            setTimeout(() => window.location.reload(), 400);
        }
    }, [gameLoaded, timeLeft, difficulty]);


    return (
        <div className="relative min-h-screen w-full">
            <div className="relative min-h-[80vh] bg-black text-white">
                <CitySelector onCitySelected={setSelectedCity}/>
                {selectedCity && <MapDisplay city={selectedCity} setClue={setClue} setLoaded={setLoaded}/>}
            </div>
            {gameLoaded && difficulty !== "easy" && !gameOver && (
                <div className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md text-lg">
                    Time Left: {timeLeft}s
                </div>
            )}
            {gameLoaded && (
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900 w-[90%] max-w-3xl p-6 border border-gray-700 rounded-xl
                    text-center break-words truncate">
                    <h3 className="text-2xl font-semibold">Clue</h3>
                    <p className="text-lg font-mono">{clue}</p>
                </div>
            )}
        </div>
    );
}