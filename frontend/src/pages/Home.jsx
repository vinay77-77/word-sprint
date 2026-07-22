import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    function handleStartGame() {
        if (username.trim() === "") {
            alert("Please enter a username.");
            return;
        }

       localStorage.setItem("username", username);
       navigate("/game");
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
            <h1 className="text-5xl font-bold">Word Sprint</h1>

            <p className="text-gray-600">
                Solve as many 5-letter words as possible in 3 minutes.
            </p>

            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded px-4 py-2 w-72"
            />

            <button
                onClick={handleStartGame}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
                Start Game
            </button>
        </div>
    );
}