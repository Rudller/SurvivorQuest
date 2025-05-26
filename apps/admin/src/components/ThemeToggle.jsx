import { useEffect, useState } from 'react';

function getInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') return true;
  if (saved === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(getInitialTheme);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <label className="absolute top-6 right-6 flex items-center cursor-pointer z-20 select-none drop-shadow-xl">
      <input
        type="checkbox"
        checked={dark}
        onChange={() => setDark((v) => !v)}
        className="sr-only"
        aria-label="Przełącz tryb ciemny"
      />
      <div className={`w-16 h-8 flex items-center bg-gray-200 dark:bg-gray-800 rounded-full p-1 border-4 transition-colors duration-300 shadow-lg`}>
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${dark ? 'translate-x-6' : ''}`}
        />
      </div>
      <span className="ml-3 text-lg font-bold text-gray-700 dark:text-gray-200 select-none">
        {dark ? '🌙' : '☀️'}
      </span>
    </label>
  );
}
