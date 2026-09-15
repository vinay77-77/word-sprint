import GameBoard from "../components/GameBoard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFeedback } from "../feedback";

function createEmptyBoard() {
    return Array(6)
        .fill(null)
        .map(() => Array(5).fill(""));
}

function createEmptyColors() {
    return Array(6)
        .fill(null)
        .map(() => Array(5).fill(""));
}


export default function Game() {
    const GAME_TIME = 180;

    const [board, setBoard] = useState(createEmptyBoard());

    const [colors, setColors] = useState(createEmptyColors());

    const [currentColumn, setCurrentColumn] = useState(0);
    const [currentRow, setCurrentRow] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(180);
    const [gameOver, setGameOver] = useState(false);
    const [error, setError] = useState("");
    const username = localStorage.getItem("username") || "Player";
    const [targetWord, setTargetWord] = useState("");



      async function handleKeyDown(event) {
        if (gameOver) {
        return;
    }

    const key = event.key.toUpperCase();

    // BACKSPACE
    if (key === "BACKSPACE") {

        if (currentColumn === 0) {
            return;
        }

        const newBoard = board.map(row => [...row]);

        newBoard[currentRow][currentColumn - 1] = "";

        setBoard(newBoard);

        setCurrentColumn(currentColumn - 1);

        return;
    }

   // ENTER
   if (key === "ENTER") {
    setError("");

    if (currentColumn < 5) {
    setError("Word must be 5 letters long!");
        return;
    }

    const guess = board[currentRow].join("");

    const isValid = await validateGuess(guess);
    if (!isValid) {
    setError("Not in word list!");
    return;
   }

    const feedback = getFeedback(guess, targetWord);
    const newColors = colors.map(row => [...row]);
    newColors[currentRow] = feedback;

    setColors(newColors);

   if (guess === targetWord) {
    setScore(previousScore => previousScore + 10);
    await fetchTargetWord();
    resetBoard();
    return;
    }  

    if (currentRow === 5) {
        setGameOver(true);
        return;
    }

    setCurrentRow(currentRow + 1);
    setCurrentColumn(0);
    return;
}


    // NORMAL LETTERS
    if (!/^[A-Z]$/.test(key)) {
        return;
    }

    if (currentColumn >= 5) {
        return;
    }

    const newBoard = board.map(row => [...row]);

    newBoard[currentRow][currentColumn] = key;

    setBoard(newBoard);
    setError("");
    setCurrentColumn(currentColumn + 1);
}

    async function fetchTargetWord() {
    setTargetWord("");
    const response = await fetch(`${import.meta.env.VITE_API_URL}/word`);
    const data = await response.json();
    setTargetWord(data.word);
 }

    useEffect(() => {
    if (gameOver) {
        saveGame();
    }
}, [gameOver]);


    useEffect(() => {
    fetchTargetWord();
   }, []);

    useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
        window.removeEventListener("keydown", handleKeyDown);
    };
}, [board, colors, currentColumn, currentRow]);


    
async function validateGuess(guess) {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/validate`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            guess: guess,
        }),
    });

    const data = await response.json();
    return data.valid;
}

async function saveGame() {
    const username = localStorage.getItem("username") || "Player";

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/games`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                score: score,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to save game");
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error saving game:", error);
    }
}

async function restartGame() {
    resetBoard();
    setScore(0);
    setTimeLeft(GAME_TIME);
    setGameOver(false);
    setError("");
    await fetchTargetWord();
}


    function resetBoard() {
    setBoard(createEmptyBoard());
    setColors(createEmptyColors());

    setCurrentRow(0);
    setCurrentColumn(0);
}


    useEffect(() => {

    if (gameOver) {
        return;
    }

    const timer = setInterval(() => {
        setTimeLeft(previousTime => {

            if (previousTime <= 1) {
                setGameOver(true);
                return 0;
            }

            return previousTime - 1;
        });

    }, 1000);

    return () => clearInterval(timer);

 }, [gameOver]);


const minutes = Math.floor(timeLeft / 60);
const seconds = timeLeft % 60;
const formattedTime =
    `${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (!targetWord) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h2 className="text-2xl font-semibold">
                Loading game...
            </h2>
        </div>
    );
 }

    return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 relative">
        <Link
    to="/"
    className="absolute left-6 top-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
    ← Home
    </Link>

        <div className="text-center">
    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
        Word Sprint
    </h1>

    <p className="mt-2 text-gray-500">
        Solve as many words as you can before time runs out.
    </p>
</div>

 <div className="flex gap-6">

    <div className="w-36 rounded-xl border border-gray-200 bg-white shadow-sm p-4 text-center">
        <p className="text-xs uppercase tracking-wide text-gray-500">
            Time
        </p>

        <p className="mt-1 text-3xl font-bold">
            {formattedTime}
        </p>
    </div>

    <div className="w-36 rounded-xl border border-gray-200 bg-white shadow-sm p-4 text-center">
        <p className="text-xs uppercase tracking-wide text-gray-500">
            Score
        </p>

        <p className="mt-1 text-3xl font-bold">
            {score}
        </p>
    </div>

 </div>

{!gameOver && error && (
    <p className="text-red-500 font-medium">
        {error}
    </p>
)}

{
    gameOver ? (
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
        Round Complete
    </p>

    <h2 className="mt-2 text-3xl font-bold text-gray-900">
        Game Over!
    </h2>

    <p className="mt-4 text-gray-500">
        You scored
    </p>

    <p className="mt-1 text-5xl font-extrabold text-gray-900">
        {score}
    </p>

    <div className="mt-8 flex justify-center gap-3">

        <button
            onClick={restartGame}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
            Play Again
        </button>

        <a
            href="/leaderboard"
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
        >
            Leaderboard
        </a>

    </div>

</div>
    ) : (
        <GameBoard
            board={board}
            colors={colors}
        />
    )
}
    </div>
);
}
