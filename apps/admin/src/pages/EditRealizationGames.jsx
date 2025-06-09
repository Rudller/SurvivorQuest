import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditRealizationGames() {
  const { id } = useParams(); // id realizacji
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/realizacje/${id}/game-templates`)
      .then(res => res.json())
      .then(setGames)
      .catch(() => setError('Nie udało się pobrać gier przypisanych do realizacji.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleGameChange = (idx, field, value) => {
    setGames(games => games.map((g, i) => i === idx ? { ...g, [field]: value } : g));
  };

  const handleSave = async (idx) => {
    const game = games[idx];
    setError('');
    try {
      const res = await fetch(`/api/realizacje/${id}/game-templates/${game._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game),
      });
      if (!res.ok) throw new Error('Błąd podczas zapisu gry.');
    } catch (e) {
      setError('Nie udało się zapisać zmian gry.');
    }
  };

  if (loading) return <div className="p-8 text-center">Ładowanie gier...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-primary dark:text-accent-dark">Gry przypisane do realizacji</h2>
      {games.length === 0 ? (
        <div className="text-gray-400 text-center">Brak przypisanych gier.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {games.map((game, idx) => (
            <div key={game._id} className="bg-white dark:bg-primary-dark rounded-xl shadow p-4 border border-accent/30 dark:border-accent-dark/30">
              <div className="font-semibold mb-2">{game.nazwa || game.instrukcja?.slice(0, 30) || 'Gra'}</div>
              <label className="block mb-1 text-sm">Instrukcja
                <textarea
                  className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-primary-dark/40 text-black dark:text-white"
                  value={game.instrukcja}
                  onChange={e => handleGameChange(idx, 'instrukcja', e.target.value)}
                />
              </label>
              <label className="block mb-1 text-sm">Punktacja
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-primary-dark/40 text-black dark:text-white"
                  value={game.punktacja}
                  onChange={e => handleGameChange(idx, 'punktacja', Number(e.target.value))}
                />
              </label>
              <label className="block mb-1 text-sm">Typ gry
                <select
                  className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-primary-dark/40 text-black dark:text-white"
                  value={game.typ}
                  onChange={e => handleGameChange(idx, 'typ', e.target.value)}
                >
                  <option value="terenowa">Terenowa</option>
                  <option value="logiczna">Logiczna</option>
                  <option value="znajdźka">Znajdźka</option>
                  <option value="inna">Inna</option>
                </select>
              </label>
              <button
                className="mt-2 px-4 py-2 rounded bg-accent dark:bg-accent-dark text-white font-bold hover:bg-highlight dark:hover:bg-highlight-dark"
                onClick={() => handleSave(idx)}
              >
                Zapisz zmiany
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        className="mt-8 px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
        onClick={() => navigate(-1)}
      >
        Powrót
      </button>
    </div>
  );
}
