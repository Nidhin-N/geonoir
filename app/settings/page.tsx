'use client'; //Ensures component runs client-side
import { useState, useEffect } from "react";
import Link from "next/link";

//Settings page component to allow users to select difficulty
export default function Settings() {
    //State to store difficulty
    const [difficulty, setDifficulty] = useState("easy");
    //On component start, load saved difficulty from localStorage if available
    useEffect(() => {
        const playerDifficulty = localStorage.getItem("difficulty");
        if (playerDifficulty) {
            setDifficulty(playerDifficulty);
        }
    }, []);

    //Updates the difficulty state and saves to localStorage
    const setDifficultyChange = (diff: string) => {
        setDifficulty(diff);
        localStorage.setItem("difficulty", diff)
    };

    //Logs current difficulty to console for debugging
    useEffect(() => {
        console.log("Difficulty", difficulty)
    }, [difficulty]);

    return (
        <div
            className="grid grid-rows items-center justify-items-center min-h-screen w-full  bg-center bg-no-repeat"
            style={{backgroundImage: "url('/homebg.png')", backgroundSize: 'cover'}}>
            <h1 className="text-3xl font-bold">Select Difficulty</h1>
            {/* Difficulty Selection Buttons */}
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
            {/* Link to return to Home */}
            <Link
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                href="home"
            >
                Main Menu
            </Link>
        </div>
    );
}


