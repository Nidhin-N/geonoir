'use client'; //Ensures component runs client-side
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import {useEffect, useState} from 'react';
import CitySelector from "../components/citySelector";
import dynamic from "next/dynamic";

// Dynamic import MapDisplay to stop server-side rendering due to Leaflet being problematic with SSR
const MapDisplay = dynamic(() => import("../components/mapDisplay"), { ssr: false });

export default function Page() {
    //Game state hooks
    const [selectedCity, setSelectedCity] = useState<{ name: string; lat: number; lon: number } | null>(null);
    const [clue, setClue] = useState<string>(''); //Current clue string
    const [gameLoaded, setLoaded] = useState(false); //True when map and game data loaded
    const [difficulty, setDifficulty] = useState<"easy"|"medium"|"hard">("easy"); //Difficulty either one of three default is easy (to avoid any incorrectly formatted data)
    const [timeLeft, setTimeLeft] = useState(120); //Timer countdown
    const [gameOver, setGameOver] = useState(false); //Tracks if timer has finished.

    //Loads leaflet icons and assets and difficulty from localStorage
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
        //Get saved difficulty from localStorage and set initial timer as 120s (2 minutes)
        const playerDifficulty = localStorage.getItem("difficulty") as "easy"|"medium"|"hard"; //To avoid errors
        if (playerDifficulty) {
            setDifficulty(playerDifficulty);
            if (playerDifficulty === "medium" || playerDifficulty === "hard"){
                setTimeLeft(120);
            }
        }
    }, []);

    //Timer logic for medium and hard mode and game over trigger event
    useEffect(() => {
        if (gameLoaded && difficulty !== "easy" && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);

            //Clear interval after every game
            return () => clearInterval(timer);
        }

        //Handle timer run out
        if (timeLeft === 0) {
            setGameOver(true);
            setClue("Time's up! The killer got away");
            //Reload game after 4 seconds
            setTimeout(() => window.location.reload(), 4000);
        }
    }, [gameLoaded, timeLeft, difficulty]);


    return (
        <div className="relative min-h-screen w-full">
            <div className="relative min-h-[80vh] bg-black text-white">
                {/*Renders city name and retrieves passed object from child*/}
                <CitySelector onCitySelected={setSelectedCity}/>
                {/*Display map and start clue logic after city is loaded*/}
                {selectedCity && <MapDisplay city={selectedCity} setClue={setClue} setLoaded={setLoaded}/>}
            </div>
            {/*Timer is only shown for medium and hard difficulty*/}
            {gameLoaded && difficulty !== "easy" && !gameOver && (
                <div className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md text-lg">
                    Time Left: {timeLeft}s
                </div>
            )}
            {/*Clue box displayed when game is loaded*/}
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