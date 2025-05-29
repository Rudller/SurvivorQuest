import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function SidePanel({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-72 max-w-full bg-white dark:bg-gradient-to-b dark:from-primary-dark dark:to-background-dark shadow-2xl z-30 transform transition-transform duration-300 border-r-4 border-accent dark:border-accent-dark flex flex-col ${open ? 'translate-x-0' : '-translate-x-full'}`}
      style={{ minWidth: 260, fontFamily: 'Montserrat, system-ui, Avenir, Helvetica, Arial, sans-serif' }}
      role="navigation"
      aria-label="Panel boczny"
    >
      <button
        className="absolute top-2 left-3 w-12 h-12 text-accent dark:text-accent-dark hover:text-highlight dark:hover:text-highlight-dark focus:outline-none text-3xl font-bold p-1 rounded transition-colors"
        onClick={onClose}
        aria-label="Zamknij panel"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <div className="p-8 pt-20 flex-1 flex flex-col gap-8">
        <h2 className="text-2xl font-extrabold text-secondary dark:text-white tracking-wide mb-2 select-none">Eventy</h2>
        <nav className="flex flex-col gap-4">
          <a href="/realization" className="w-full text-lg text-left px-4 py-2 rounded-xl font-semibold bg-transparent hover:bg-accent text-black dark:text-white dark:bg-transparent dark:hover:bg-accent-dark transition-colors shadow-sm border border-accent dark:border-accent-dark cursor-pointer no-underline focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark hover:border-primary dark:hover:border-accent-dark [&:hover]:text-black">
            Realizacje
          </a>
          <button
            className="w-full text-lg text-left px-4 py-2 rounded-xl font-semibold bg-transparent hover:bg-accent text-black dark:text-white dark:bg-transparent dark:hover:bg-accent-dark transition-colors shadow-sm border border-accent dark:border-accent-dark cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark hover:border-primary dark:hover:border-accent-dark [&:hover]:text-black dark:[&:hover]:text-white"
            onClick={() => { navigate('/managegames'); onClose && onClose(); }}
          >
            Zarządzanie Grami
          </button>
          <button className="w-full text-lg text-left px-4 py-2 rounded-xl font-semibold bg-transparent hover:bg-accent text-black dark:text-white dark:bg-transparent dark:hover:bg-accent-dark transition-colors shadow-sm border border-accent dark:border-accent-dark cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark hover:border-primary dark:hover:border-accent-dark [&:hover]:text-black dark:[&:hover]:text-white">Instrukcje do stanowisk</button>
          <button
            className="w-full text-lg text-left px-4 py-2 rounded-xl font-semibold bg-transparent hover:bg-accent text-black dark:text-white dark:bg-transparent dark:hover:bg-accent-dark transition-colors shadow-sm border border-accent dark:border-accent-dark cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark hover:border-primary dark:hover:border-accent-dark [&:hover]:text-black dark:[&:hover]:text-white"
            onClick={() => { navigate('/addgametemplate'); onClose && onClose(); }}
          >
            Dodaj szablon gry
          </button>
        </nav>
        <div className="flex justify-center mt-8">
          <ThemeToggle />
        </div>
      </div>
      <div className="p-4 text-xs text-center text-gray-400 dark:text-gray-500 select-none">
        © {new Date().getFullYear()} SurvivorQuest
      </div>
      <button
        className="w-full text-lg text-left px-4 py-2 rounded-xl font-semibold bg-transparent hover:bg-accent text-black dark:text-white dark:bg-transparent dark:hover:bg-accent-dark transition-colors shadow-sm border border-accent dark:border-accent-dark cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark hover:border-primary dark:hover:border-accent-dark [&:hover]:text-black dark:[&:hover]:text-white"
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          onClose && onClose();
        }}
      >
        Wyloguj się
      </button>
    </aside>
  );
}
