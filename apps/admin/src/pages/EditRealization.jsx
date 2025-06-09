import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function EditRealization() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nazwaFirmy: '',
    lokalizacja: '',
    status: '',
    startDate: '',
    opis: '',
    iloscDruzyn: '',
    dodatkoweUstawienia: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [gamesError, setGamesError] = useState('');

  useEffect(() => {
    fetch(`/api/realizacje/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          nazwaFirmy: data.nazwaFirmy || '',
          lokalizacja: data.lokalizacja || '',
          status: data.status || '',
          startDate: data.startDate ? data.startDate.slice(0, 10) : '',
          opis: data.opis || '',
          iloscDruzyn: data.iloscDruzyn || '',
          dodatkoweUstawienia: data.dodatkoweUstawienia || {},
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Nie udało się pobrać realizacji.');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    setGamesLoading(true);
    fetch(`/api/realizacje/${id}/game-templates`)
      .then(res => res.json())
      .then(setGames)
      .catch(() => setGamesError('Nie udało się pobrać gier przypisanych do realizacji.'))
      .finally(() => setGamesLoading(false));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'iloscDruzyn' ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleGameChange = (idx, field, value) => {
    setGames(games => games.map((g, i) => i === idx ? { ...g, [field]: value } : g));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    const updated = { ...form, startDate: form.startDate ? new Date(form.startDate).toISOString() : null };
    const res = await fetch(`/api/realizacje/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      navigate('/realization');
    } else {
      setError('Błąd podczas zapisu zmian.');
    }
  };

  const handleGameSave = async (idx) => {
    const game = games[idx];
    setGamesError('');
    try {
      const res = await fetch(`/api/realizacje/${id}/game-templates/${game._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game),
      });
      if (!res.ok) throw new Error('Błąd podczas zapisu gry.');
    } catch (e) {
      setGamesError('Nie udało się zapisać zmian gry.');
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-background dark:bg-background-dark overflow-x-hidden">
      <Header />
      <div className="flex flex-col items-center px-4 py-8 text-black dark:text-white text-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-accent-dark">Edytuj realizację</h1>
        <div className="w-full max-w-xl bg-white dark:bg-primary-dark rounded-xl shadow p-6">
          {loading ? (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500">Ładowanie...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Nazwa firmy</span>
                <input
                  type="text"
                  name="nazwaFirmy"
                  value={form.nazwaFirmy}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 bg-gray-50 dark:bg-primary-dark/40 text-black dark:text-white"
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Lokalizacja</span>
                <input
                  type="text"
                  name="lokalizacja"
                  value={form.lokalizacja}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 bg-gray-50 dark:bg-primary-dark/40 text-black dark:text-white"
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Status</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 bg-gray-50 dark:bg-primary-dark/40 text-black dark:text-white"
                  required
                >
                  <option value="zaplanowana">Zaplanowana</option>
                  <option value="aktywna">Aktywna</option>
                  <option value="zakończona">Zakończona</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Data realizacji</span>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 bg-gray-50 dark:bg-primary-dark/40 text-black dark:text-white"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Opis</span>
                <textarea
                  name="opis"
                  value={form.opis}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 bg-gray-50 dark:bg-primary-dark/40 text-black dark:text-white min-h-[60px]"
                  placeholder="Opis wydarzenia"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Ilość drużyn</span>
                <input
                  type="number"
                  name="iloscDruzyn"
                  value={form.iloscDruzyn}
                  onChange={handleChange}
                  min="1"
                  className="border rounded px-3 py-2 bg-gray-50 dark:bg-primary-dark/40 text-black dark:text-white"
                  placeholder="np. 5"
                />
              </label>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  className="flex-1 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={() => navigate('/realization')}
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-accent dark:bg-accent-dark text-white font-bold hover:bg-highlight dark:hover:bg-highlight-dark"
                >
                  Zapisz
                </button>
              </div>
            </form>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 text-primary dark:text-accent-dark">Gry przypisane do realizacji</h2>
              {gamesLoading ? (
                <div className="p-4 text-center text-gray-400 dark:text-gray-500">Ładowanie gier...</div>
              ) : gamesError ? (
                <div className="p-4 text-center text-red-500">{gamesError}</div>
              ) : games.length === 0 ? (
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
                        onClick={() => handleGameSave(idx)}
                      >
                        Zapisz zmiany
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full p-2 text-xs text-center text-gray-400 dark:text-gray-500 select-none z-40 bg-transparent pointer-events-none">
        Panel jest w fazie rozwoju – niektóre opcje mogą być niedostępne.
      </div>
    </div>
  );
}
