import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Realization() {
  const [realizacje, setRealizacje] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/realizacje')
      .then(res => res.json())
      .then(data => setRealizacje(data))
      .catch(() => setRealizacje([]));
  }, []);

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-background dark:bg-background-dark overflow-x-hidden">
      <Header />
      <div className="flex flex-col items-center px-4 py-8 text-black dark:text-white text-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-accent-dark">Realizacje</h1>
        <p className="mb-4 text-center">
          Tutaj możesz przeglądać, dodawać i zarządzać realizacjami eventów oraz przypisywać do nich gry i drużyny.
        </p>
        <button
          className="mt-2 mb-8 px-6 py-3 rounded-xl bg-accent dark:bg-accent-dark text-white font-bold text-base shadow-md hover:bg-highlight dark:hover:bg-highlight-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark"
          onClick={() => navigate('/addrealization')}
        >
          Dodaj nową realizację
        </button>
        <div className="w-full flex flex-col items-center gap-4">
          {realizacje === null ? (
            <span className="text-gray-400 dark:text-gray-500 text-sm">Ładowanie...</span>
          ) : realizacje.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full py-12">
              <div className="text-5xl mb-2 opacity-30 select-none">🗂️</div>
              <span className="text-base font-semibold text-accent dark:text-accent-dark bg-accent/10 dark:bg-accent-dark/10 px-6 py-3 rounded-xl shadow-sm border border-accent/30 dark:border-accent-dark/30">
                Brak realizacji do wyświetlenia.
              </span>
            </div>
          ) : (
            realizacje.map(r => (
              <div key={r._id} className="w-full bg-white dark:bg-primary-dark rounded-xl shadow p-4 border border-accent/30 dark:border-accent-dark/30">
                <div className="font-bold text-primary dark:text-accent-dark text-lg">{r.nazwaFirmy}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{r.lokalizacja}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">Status: {r.status}</div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full p-2 text-xs text-center text-gray-400 dark:text-gray-500 select-none z-40 bg-transparent pointer-events-none">
        Panel jest w fazie rozwoju – niektóre opcje mogą być niedostępne.
      </div>
    </div>
  );
}
