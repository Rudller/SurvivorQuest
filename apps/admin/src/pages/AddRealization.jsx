import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AddRealization() {
  const [form, setForm] = useState({
    nazwaFirmy: '',
    lokalizacja: '',
    startDate: '', // zmiana z 'data' na 'startDate'
    status: '',
    iloscDruzyn: '',
    gameTemplates: [],
  });
  const [availableGameTemplates, setAvailableGameTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showGameTemplateDropdown, setShowGameTemplateDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const gameTemplateDropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  React.useEffect(() => {
    fetch('/api/game-templates')
      .then(res => res.json())
      .then(data => setAvailableGameTemplates(data))
      .catch(() => setAvailableGameTemplates([]));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (gameTemplateDropdownRef.current && !gameTemplateDropdownRef.current.contains(event.target)) {
        setShowGameTemplateDropdown(false);
      }
    }
    if (showGameTemplateDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showGameTemplateDropdown]);

  const validateForm = () => {
    return (
      form.nazwaFirmy.trim() &&
      form.lokalizacja.trim() &&
      form.startDate &&
      form.status &&
      form.iloscDruzyn &&
      Array.isArray(form.gameTemplates) && form.gameTemplates.length > 0
    );
  };

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user.id ? user.id : undefined;
    } catch {
      return undefined;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!validateForm()) {
      setShowConfirm(true);
      setPendingSubmit(true);
      return;
    }
    setLoading(true);
    try {
      // 1. Create the realization
      const payload = { ...form, iloscDruzyn: Number(form.iloscDruzyn), utworzonaPrzez: getUserId() };
      const res = await fetch('/api/realizacje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error('Błąd podczas zapisu.');
      }
      const realizacja = await res.json();
      // 2. Assign games to the realization
      for (const graId of form.gameTemplates) {
        const assignRes = await fetch(`/api/realizacje/${realizacja._id}/game-templates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ graId }),
        });
        if (!assignRes.ok) {
          throw new Error('Błąd podczas przypisywania gry do realizacji.');
        }
      }
      setSuccess(true);
      setTimeout(() => navigate('/realization'), 1200);
    } catch (err) {
      setError('Nie udało się dodać realizacji lub przypisać gier.');
      console.error('Catch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    if (pendingSubmit) {
      setLoading(true);
      setPendingSubmit(false);
      try {
        // 1. Create the realization
        const payload = { ...form, iloscDruzyn: Number(form.iloscDruzyn), utworzonaPrzez: getUserId() };
        const res = await fetch('/api/realizacje', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error('Błąd podczas zapisu.');
        }
        const realizacja = await res.json();
        // 2. Assign games to the realization
        for (const graId of form.gameTemplates) {
          const assignRes = await fetch(`/api/realizacje/${realizacja._id}/game-templates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ graId }),
          });
          if (!assignRes.ok) {
            throw new Error('Błąd podczas przypisywania gry do realizacji.');
          }
        }
        setSuccess(true);
        setTimeout(() => navigate('/realization'), 1200);
      } catch (err) {
        setError('Nie udało się dodać realizacji lub przypisać gier.');
        console.error('Catch error (confirm):', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingSubmit(false);
  };

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-background dark:bg-background-dark overflow-x-hidden">
      <Header />
      <div className="flex flex-col items-center px-4 py-8 text-black dark:text-white text-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-accent-dark">Dodaj realizację</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 bg-white dark:bg-primary-dark rounded-xl shadow p-6 border border-accent/30 dark:border-accent-dark/30">
          <label className="font-semibold">Nazwa firmy
            <input name="nazwaFirmy" value={form.nazwaFirmy} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
          </label>
          <label className="font-semibold">Lokalizacja
            <input name="lokalizacja" value={form.lokalizacja} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
          </label>
          <label className="font-semibold">Data
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
          </label>
          <label className="font-semibold">Status
            <select name="status" value={form.status} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark">
              <option value="">Wybierz status</option>
              <option value="zaplanowana">Zaplanowana</option>
              <option value="aktywna">Aktywna</option>
              <option value="zakończona">Zakończona</option>
            </select>
          </label>
          <label className="font-semibold">Ilość drużyn
            <input name="iloscDruzyn" type="number" min="1" value={form.iloscDruzyn} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2 bg-background dark:bg-background-dark" />
          </label>
          <label className="font-semibold">Gry
            <div className="relative mt-1">
              <button
                type="button"
                className="w-full rounded border px-3 py-2 bg-background dark:bg-background-dark flex justify-between items-center cursor-pointer"
                onClick={() => setShowGameTemplateDropdown(v => !v)}
              >
                {form.gameTemplates.length === 0
                  ? 'Wybierz gry...'
                  : availableGameTemplates.filter(gra => form.gameTemplates.includes(gra._id)).map(gra => gra.nazwa).join(', ')}
                <span className="ml-2">▼</span>
              </button>
              {showGameTemplateDropdown && (
                <div ref={gameTemplateDropdownRef} className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-primary-dark border border-accent/30 dark:border-accent-dark/30 rounded shadow-lg max-h-60 overflow-y-auto">
                  {availableGameTemplates.length === 0 ? (
                    <span className="block px-4 py-2 text-gray-400 text-sm">Brak dostępnych gier</span>
                  ) : (
                    availableGameTemplates.map(gra => (
                      <label key={gra._id} className="flex items-center gap-2 px-4 py-2 hover:bg-accent/10 dark:hover:bg-accent-dark/10 cursor-pointer">
                        <input
                          type="checkbox"
                          name="gameTemplates"
                          value={gra._id}
                          checked={form.gameTemplates.includes(gra._id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setForm(f => ({ ...f, gameTemplates: [...(Array.isArray(f.gameTemplates) ? f.gameTemplates : []), gra._id] }));
                            } else {
                              setForm(f => ({ ...f, gameTemplates: (Array.isArray(f.gameTemplates) ? f.gameTemplates : []).filter(id => id !== gra._id) }));
                            }
                          }}
                          className="accent-accent dark:accent-accent-dark"
                        />
                        <span>{gra.nazwa}</span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          </label>
          <button type="submit" disabled={loading} className="mt-4 px-6 py-3 rounded-xl bg-accent dark:bg-accent-dark text-white font-bold text-base shadow-md hover:bg-highlight dark:hover:bg-highlight-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark disabled:opacity-60">
            {loading ? 'Zapisywanie...' : 'Dodaj realizację'}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-500 text-sm mt-2">Dodano realizację!</div>}
        </form>
      </div>
      <div className="fixed bottom-0 left-0 w-full p-2 text-xs text-center text-gray-400 dark:text-gray-500 select-none z-40 bg-transparent pointer-events-none">
        Panel jest w fazie rozwoju – niektóre opcje mogą być niedostępne.
      </div>
      <ConfirmDialog
        open={showConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message="Nie wszystkie dane są uzupełnione, czy kontynuować?"
      />
    </div>
  );
}
