import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddGame() {
  const { realizacjaId } = useParams();
  const [form, setForm] = useState({
    graId: '', // szablon gry
    instrukcja: '',
    obrazek: '',
    punktacja: 100,
    typ: 'terenowa',
    gps: { lat: '', lng: '', radius: '' },
    qrCode: '',
  });
  const [gameTemplates, setGameTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetch('/api/game-templates')
      .then(res => res.json())
      .then(data => setGameTemplates(data))
      .catch(() => setGameTemplates([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name.startsWith('gps.')) {
      const gpsField = name.split('.')[1];
      setForm(f => ({ ...f, gps: { ...f.gps, [gpsField]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: type === 'number' ? Number(value) : value }));
    }
  };

  const handleTemplateSelect = (e) => {
    const selectedId = e.target.value;
    setForm(f => ({ ...f, graId: selectedId }));
    const szablon = gameTemplates.find(g => g._id === selectedId);
    if (szablon) {
      setForm(f => ({
        ...f,
        graId: selectedId,
        instrukcja: szablon.opis || '',
        obrazek: '',
        punktacja: 100,
        typ: szablon.typ || 'terenowa',
        gps: szablon.dodatkoweUstawienia?.gps || { lat: '', lng: '', radius: '' },
        qrCode: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    const payload = {
      graId: form.graId,
      instrukcja: form.instrukcja,
      obrazek: form.obrazek,
      punktacja: Number(form.punktacja),
      typ: form.typ,
      gps: {
        lat: form.gps.lat ? Number(form.gps.lat) : undefined,
        lng: form.gps.lng ? Number(form.gps.lng) : undefined,
        radius: form.gps.radius ? Number(form.gps.radius) : undefined,
      },
      qrCode: form.qrCode,
    };
    try {
      const res = await fetch(`/api/realizacje/${realizacjaId}/gry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Błąd podczas zapisu.');
      setSuccess(true);
      setTimeout(() => navigate(`/realizacje/${realizacjaId}/gry`), 1200);
    } catch (err) {
      setError('Nie udało się dodać gry do realizacji.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-background dark:bg-background-dark overflow-x-hidden">
      <Header />
      <div className="flex flex-col items-center px-4 py-8 text-black dark:text-white text-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-accent-dark">Dodaj grę do realizacji</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 bg-white dark:bg-primary-dark rounded-xl shadow p-6 border border-accent/30 dark:border-accent-dark/30">
          <label className="font-semibold">Wybierz szablon gry
            <select name="graId" value={form.graId} onChange={handleTemplateSelect} required className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark">
              <option value="">Wybierz...</option>
              {gameTemplates.map(gra => (
                <option key={gra._id} value={gra._id}>{gra.nazwa}</option>
              ))}
            </select>
          </label>
          <label className="font-semibold">Instrukcja
            <textarea name="instrukcja" value={form.instrukcja} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
          </label>
          <label className="font-semibold">Obrazek (URL)
            <input name="obrazek" value={form.obrazek} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
          </label>
          <label className="font-semibold">Punktacja
            <input name="punktacja" type="number" min="0" value={form.punktacja} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
          </label>
          <label className="font-semibold">Typ gry
            <select name="typ" value={form.typ} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark">
              <option value="terenowa">Terenowa</option>
              <option value="logiczna">Logiczna</option>
              <option value="znajdźka">Znajdźka</option>
              <option value="inna">Inna</option>
            </select>
          </label>
          <div className="flex gap-4">
            <label className="font-semibold flex-1">GPS lat
              <input name="gps.lat" type="number" value={form.gps.lat} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
            </label>
            <label className="font-semibold flex-1">GPS lng
              <input name="gps.lng" type="number" value={form.gps.lng} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
            </label>
            <label className="font-semibold flex-1">Promień (m)
              <input name="gps.radius" type="number" value={form.gps.radius} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
            </label>
          </div>
          <label className="font-semibold">Kod QR (opcjonalnie)
            <input name="qrCode" value={form.qrCode} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
          </label>
          <button type="submit" disabled={loading} className="mt-4 px-6 py-3 rounded-xl bg-accent dark:bg-accent-dark text-white font-bold text-base shadow-md hover:bg-highlight dark:hover:bg-highlight-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark disabled:opacity-60">
            {loading ? 'Zapisywanie...' : 'Dodaj grę do realizacji'}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-500 text-sm mt-2">Dodano grę do realizacji!</div>}
        </form>
      </div>
    </div>
  );
}
