import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function ManageGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/gry')
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(() => setError('Failed to load games.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-background dark:bg-background-dark overflow-x-hidden">
      <Header />
      <div className="flex flex-col items-center px-4 py-8 text-black dark:text-white text-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-accent-dark">Zarządzanie grami</h1>
        <button
          className="mb-6 px-6 py-3 rounded-xl bg-accent dark:bg-accent-dark text-white font-bold text-base shadow-md hover:bg-highlight dark:hover:bg-highlight-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark disabled:opacity-60"
          onClick={() => navigate('/addgame')}
        >
          Dodaj nową grę
        </button>
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="w-full bg-white dark:bg-primary-dark rounded-xl shadow p-6 border border-accent/30 dark:border-accent-dark/30">
            {games.length === 0 ? (
              <div className="text-gray-400 text-center">No games found.</div>
            ) : (
              <ul className="divide-y divide-accent/20 dark:divide-accent-dark/20">
                {games.map(game => (
                  <li key={game._id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <span className="font-semibold">{game.nazwa}</span>
                      {game.opis && <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{game.opis}</span>}
                    </div>
                    <span className="inline-block px-2 py-1 rounded bg-accent/10 dark:bg-accent-dark/10 text-xs text-accent dark:text-accent-dark">
                      {game.typ}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
