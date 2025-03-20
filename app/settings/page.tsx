'use client';
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Settings() {
    const [difficulty, setDifficulty] = useState("easy");

    useEffect(() => {
        const playerDifficulty = localStorage.getItem("difficulty");
        if (playerDifficulty) {
            setDifficulty(playerDifficulty);
        }
    }, []);

    const setDifficultyChange = (diff: string) => {
        setDifficulty(diff);
        localStorage.setItem("difficulty", diff)
    };

    useEffect(() => {
        console.log("Difficulty", difficulty)
    }, [difficulty]);

    return (
        <div
            className="grid grid-rows items-center justify-items-center min-h-screen w-full  bg-center bg-no-repeat"
            style={{backgroundImage: "url('/homebg.png')", backgroundSize: 'cover'}}>
            <h1 className="text-3xl font-bold">Select Difficulty</h1>
            <div className="w-full flex justify-center gap-10">
                <button onClick={() => setDifficultyChange("easy")}
                        className={`px-6 py-3 rounded-md ${difficulty === "easy" ? "bg-green-600" : "bg-gray-600"} text-white`}>No Timer
                </button>
                <button onClick={() => setDifficultyChange("medium")}
                        className={`px-6 py-3 rounded-md ${difficulty === "medium" ? "bg-orange-600" : "bg-gray-600"} text-white`}>2 Minutes
                </button>
                <button onClick={() => setDifficultyChange("hard")}
                        className={`px-6 py-3 rounded-md ${difficulty === "hard" ? "bg-red-700" : "bg-gray-600"} text-white`}>2 Minutes No Clues
                </button>
            </div>
            <Link
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                href="home"
            >
                Main Menu
            </Link>
        </div>
    );
}


