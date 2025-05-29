import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

export default function ManageGames() {
  const [gameTemplates, setGameTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/game-templates')
      .then(res => res.json())
      .then(data => setGameTemplates(data))
      .catch(() => setError('Failed to load game templates.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-background dark:bg-background-dark overflow-x-hidden">
      <Header />
      <div className="flex flex-col items-center px-4 py-8 text-black dark:text-white text-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-accent-dark">Zarządzanie szablonami gier</h1>
        <button
          className="mb-6 px-6 py-3 rounded-xl bg-accent dark:bg-accent-dark text-white font-bold text-base shadow-md hover:bg-highlight dark:hover:bg-highlight-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark disabled:opacity-60"
          onClick={() => navigate('/addgame')}
        >
          Dodaj nowy szablon gry
        </button>
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="w-full bg-white dark:bg-primary-dark rounded-xl shadow p-6 border border-accent/30 dark:border-accent-dark/30">
            {gameTemplates.length === 0 ? (
              <div className="text-gray-400 text-center">Nie znaleziono szablonów gier.</div>
            ) : (
              <ul className="divide-y divide-accent/20 dark:divide-accent-dark/20">
                {gameTemplates.map(template => (
                  <li key={template._id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{template.nazwa}</span>
                      {template.instrukcja && <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{template.instrukcja}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2 py-1 rounded bg-accent/10 dark:bg-accent-dark/10 text-xs text-accent dark:text-accent-dark">
                        {template.typ}
                      </span>
                      <button
                        className="ml-2 p-2 rounded hover:bg-accent/20 dark:hover:bg-accent-dark/20 text-accent dark:text-accent-dark"
                        title="Edytuj szablon gry"
                        onClick={() => navigate(`/editgametemplate/${template._id}`)}
                      >
                        <FaEdit />
                      </button>
                    </div>
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
