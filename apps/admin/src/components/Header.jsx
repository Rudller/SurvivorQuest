import React, { useEffect, useState } from 'react';
import SidePanel from '../components/SidePanel';
import logo from '../assets/Logo-SurvivorQuest.png';

export default function Header() {
  const [sideOpen, setSideOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try to get user from custom token first
    let userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        return;
      } catch (e) {
        // fallback to next
      }
    }
    // Try to get user from Supabase token
    const sbToken = localStorage.getItem('sb-xlqgujaxepagnjnbhmqw-auth-token');
    if (sbToken) {
      try {
        const sbObj = JSON.parse(sbToken);
        if (sbObj.user && sbObj.user.email) {
          setUser({ email: sbObj.user.email, id: sbObj.user.id, role: sbObj.user.role });
          return;
        }
      } catch (e) {
        // fallback to nothing
      }
    }
    setUser(null);
  }, []);

  return (
    <>
      <header className="w-full flex items-center justify-between px-4 py-2 bg-primary dark:bg-primary-dark text-white dark:text-black shadow-md rounded-b-2xl relative z-20">
        {/* Burger menu (mobile/tablet) */}
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-transparent hover:bg-secondary/20 dark:hover:bg-secondary-dark/30 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary dark:focus:ring-offset-primary-dark group cursor-pointer"
          onClick={() => setSideOpen(true)}
          aria-label="Otwórz menu"
          tabIndex={0}
          role="button"
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSideOpen(true); }}
        >
          <span className="sr-only">Menu</span>
          {/* Ikona burgera */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="3" y1="6" x2="21" y2="6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:hidden" />
            <line x1="3" y1="12" x2="21" y2="12" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:hidden" />
            <line x1="3" y1="18" x2="21" y2="18" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:hidden" />
            <line x1="3" y1="6" x2="21" y2="6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden dark:inline" />
            <line x1="3" y1="12" x2="21" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden dark:inline" />
            <line x1="3" y1="18" x2="21" y2="18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden dark:inline" />
          </svg>
        </div>
        {/* Logo na środku */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none" style={{ width: 48, height: 48 }}>
          <img
            src={logo}
            alt="SurvivorQuest logo"
            className="w-full h-full object-contain drop-shadow-lg transition duration-300 dark:invert"
            draggable="false"
          />
        </div>
        {/* User info po prawej */}
        <div className="flex items-center justify-end w-10 h-10 min-w-0 max-w-xs">
          {/* <ThemeToggle /> */}
          {user && (
            <span className="ml-2 text-[8px] text-white dark:text-black font-semibold bg-accent dark:bg-accent-dark px-1.5 py-0.5 rounded shadow whitespace-nowrap">
              {user.email || user.name || 'Użytkownik'}
            </span>
          )}
        </div>
      </header>
      <SidePanel open={sideOpen} onClose={() => setSideOpen(false)} />
      {/* Tło do zamykania panelu po kliknięciu poza nim */}
      {sideOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={() => setSideOpen(false)}
          aria-label="Zamknij panel boczny"
        />
      )}
    </>
  );
}
