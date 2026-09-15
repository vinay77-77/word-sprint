import { useEffect, useState } from "react";

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/leaderboard`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        return response.json();
      })
      .then((data) => {
        setPlayers(data);
      })
      .catch(() => {
        setError("Unable to load leaderboard.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Word Sprint
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Daily Leaderboard
          </h1>

          <p className="mt-3 text-slate-500">
            The highest scores from today’s games.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading && (
            <p className="px-6 py-10 text-center text-slate-500">
              Loading leaderboard...
            </p>
          )}

          {error && (
            <p className="px-6 py-10 text-center text-red-500">
              {error}
            </p>
          )}

          {!loading && !error && players.length === 0 && (
            <p className="px-6 py-10 text-center text-slate-500">
              No scores have been recorded today.
            </p>
          )}

          {!loading && !error && players.length > 0 && (
            <div className="divide-y divide-slate-100">
              {players.map((player, index) => (
                <div
                  key={`${player.username}-${index}`}
                  className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                      {index + 1}
                    </span>

                    <span className="font-medium text-slate-800">
                      {player.username}
                    </span>
                  </div>

                  <span className="font-bold text-blue-600">
                    {player.score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Leaderboard;