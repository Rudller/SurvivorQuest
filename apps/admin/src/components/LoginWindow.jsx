import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginWindow({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Podaj e-mail i hasło.');
      return;
    }
    setError('');
    try {
      const ok = await onLogin(email, password);
      if (ok) {
        navigate('/');
      }
    } catch (err) {
      setError(err?.message || 'Błąd logowania');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <>
      <form className="w-full flex flex-col gap-4 relative px-2 sm:px-0" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand dark:bg-background-dark dark:text-white text-base sm:text-lg shadow-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          inputMode="email"
          onKeyDown={handleKeyDown}
        />
        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Hasło"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand dark:bg-background-dark dark:text-white text-base sm:text-lg shadow-sm w-full pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:brightness-200 dark:hover:text-white dark:hover:brightness-200 transition-colors rounded-r-lg bg-transparent border-none focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
            style={{padding: 0}}
          >
            {showPassword ? (
              // Oko otwarte (pokazane hasło)
              <svg width="22px" height="22px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="bi bi-eye">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
              </svg>
            ) : (
              // Oko "uśmiechnięte" (nie pokazane hasło)
              <svg width="21px" height="21px" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" transform="translate(2 10)">
                  <path d="m0 .5c2.53705308 3.66666667 5.37038642 5.5 8.5 5.5 3.1296136 0 5.9629469-1.83333333 8.5-5.5"/>
                  <path d="m2.5 3.423-2 2.077"/>
                  <path d="m14.5 3.423 2 2.077"/>
                  <path d="m10.5 6 1 2.5"/>
                  <path d="m6.5 6-1 2.5"/>
                </g>
              </svg>
            )}
          </button>
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="px-4 py-3 rounded-lg bg-accent dark:bg-accent-dark text-white font-semibold hover:bg-highlight dark:hover:bg-highlight-dark transition-colors duration-200 text-base sm:text-lg shadow-md active:scale-95 border-2 border-transparent hover:border-accent focus:border-highlight"
        >
          Zaloguj się
        </button>
      </form>
      <button
        type="button"
        className="w-full mt-4 px-4 py-3 rounded-lg bg-accent dark:bg-accent-dark text-white font-semibold hover:bg-highlight dark:hover:bg-highlight-dark transition-colors duration-200 text-base sm:text-lg shadow active:scale-95 border-2 border-transparent hover:border-accent focus:border-highlight opacity-80 hover:opacity-100"
        onClick={() => alert('Rejestracja nowego użytkownika (do zaimplementowania)')}
      >
        Zarejestruj nowe konto
      </button>
    </>
  );
}
