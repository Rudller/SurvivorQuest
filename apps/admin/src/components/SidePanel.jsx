import React from 'react';

export default function SidePanel({ open, onClose }) {
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
          <button className="w-full text-lg text-left px-4 py-2 rounded-xl font-semibold bg-transparent hover:bg-accent dark:bg-transparent dark:hover:bg-accent-dark text-black dark:text-white transition-colors shadow-sm border border-accent/30 dark:border-accent-dark/30">Realizacje</button>
          <button className="w-full text-lg text-left px-4 py-2 rounded-xl font-semibold bg-transparent hover:bg-accent dark:bg-transparent dark:hover:bg-accent-dark text-black dark:text-white transition-colors shadow-sm border border-accent/30 dark:border-accent-dark/30">Zarządzanie Grami</button>
          <button className="w-full text-lg text-left px-4 py-2 rounded-xl font-semibold bg-transparent hover:bg-accent dark:bg-transparent dark:hover:bg-accent-dark text-black dark:text-white transition-colors shadow-sm border border-accent/30 dark:border-accent-dark/30">Instrukcje do stanowisk</button>
        </nav>
      </div>
      <div className="p-4 text-xs text-center text-gray-400 dark:text-gray-500 select-none">
        © {new Date().getFullYear()} SurvivorQuest
      </div>
    </aside>
  );
}
