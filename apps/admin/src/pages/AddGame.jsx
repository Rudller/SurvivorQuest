import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function AddGame() {
  const [form, setForm] = useState({
    nazwa: '',
    opis: '',
    typ: 'terenowa',
    czasTrwania: '',
    aktywna: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    const payload = {
      ...form,
      czasTrwania: form.czasTrwania ? Number(form.czasTrwania) : 0,
    };
    try {
      const res = await fetch('/api/gry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Błąd podczas zapisu.');
      setSuccess(true);
      setTimeout(() => navigate('/managegames'), 1200);
    } catch (err) {
      setError('Nie udało się dodać gry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-background dark:bg-background-dark overflow-x-hidden">
      <Header />
      <div className="flex flex-col items-center px-4 py-8 text-black dark:text-white text-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-accent-dark">Dodaj grę</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 bg-white dark:bg-primary-dark rounded-xl shadow p-6 border border-accent/30 dark:border-accent-dark/30">
          <label className="font-semibold">Nazwa gry
            <input name="nazwa" value={form.nazwa} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
          </label>
          <label className="font-semibold">Opis
            <textarea name="opis" value={form.opis} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
          </label>
          <label className="font-semibold">Typ gry
            <select name="typ" value={form.typ} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark">
              <option value="terenowa">Terenowa</option>
              <option value="logiczna">Logiczna</option>
              <option value="znajdźka">Znajdźka</option>
              <option value="inna">Inna</option>
            </select>
          </label>
          <label className="font-semibold">Czas trwania (minuty)
            <input name="czasTrwania" type="number" min="0" value={form.czasTrwania} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
          </label>
          <label className="font-semibold flex items-center gap-2">
            <input type="checkbox" name="aktywna" checked={form.aktywna} onChange={handleChange} className="accent-accent dark:accent-accent-dark" />
            Gra aktywna
          </label>
          <button type="submit" disabled={loading} className="mt-4 px-6 py-3 rounded-xl bg-accent dark:bg-accent-dark text-white font-bold text-base shadow-md hover:bg-highlight dark:hover:bg-highlight-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark disabled:opacity-60">
            {loading ? 'Zapisywanie...' : 'Dodaj grę'}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-500 text-sm mt-2">Dodano grę!</div>}
        </form>
      </div>
    </div>
  );
}
