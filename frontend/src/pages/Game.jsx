import GameBoard from "../components/GameBoard";
import { useState, useEffect } from "react";
import { WORDS } from "../words";
import { getFeedback } from "../feedback";

export default function Game() {

    function getRandomWord() {
    const index = Math.floor(Math.random() * WORDS.length);
    return WORDS[index];
}
   const [board, setBoard] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
]);
    const [colors, setColors] = useState(
    Array(6)
        .fill(null)
        .map(() => Array(5).fill(""))
);
    const [currentColumn, setCurrentColumn] = useState(0);
    const [currentRow, setCurrentRow] = useState(0);
    const [score, setScore] = useState(0);
    const [targetWord, setTargetWord] = useState(getRandomWord());
    const [timeLeft, setTimeLeft] = useState(180);
    const [gameOver, setGameOver] = useState(false);
    
       function handleKeyDown(event) {
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

    if (currentColumn < 5) {
        alert("Word must be 5 letters long!");
        return;
    }

    const guess = board[currentRow].join("");

    if (!WORDS.includes(guess)) {
        alert("Not in word list!");
        return;
    }

    const feedback = getFeedback(guess, targetWord);
    const newColors = colors.map(row => [...row]);
    newColors[currentRow] = feedback;

    setColors(newColors);

   if (guess === targetWord) {

    setScore(score + 10);

    setTargetWord(getRandomWord());

    resetBoard();

    return;
    }  

    if (currentRow === 5) {
        alert(`Game over! The word was ${targetWord}`);
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

    setCurrentColumn(currentColumn + 1);
}
   useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
        window.removeEventListener("keydown", handleKeyDown);
    };

}, [board, colors, currentColumn, currentRow]);


    function resetBoard() {

    setBoard(
        Array(6)
            .fill(null)
            .map(() => Array(5).fill(""))
    );

    setColors(
        Array(6)
            .fill(null)
            .map(() => Array(5).fill(""))
    );

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

    return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">

        <h1 className="text-4xl font-bold">
            Word Sprint
        </h1>

        <h2>
            Score: {score}
        </h2>

        {
    gameOver ? (
        <div className="text-center">
            <h2 className="text-3xl font-bold">
                Game Over!
            </h2>

            <p className="mt-4">
                Final Score: {score}
            </p>
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