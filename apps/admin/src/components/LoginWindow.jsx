import { useState } from 'react';

export default function LoginWindow({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Podaj e-mail i hasło.');
      return;
    }
    setError('');
    if (onLogin) onLogin(email, password);
  };

  return (
    <form className="w-full flex flex-col gap-4 relative px-2 sm:px-0" onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="E-mail"
        className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand dark:bg-background-dark dark:text-white text-base sm:text-lg shadow-sm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
        inputMode="email"
      />
      <input
        type="password"
        placeholder="Hasło"
        className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand dark:bg-background-dark dark:text-white text-base sm:text-lg shadow-sm"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <button
        type="submit"
        className="px-4 py-3 rounded-lg bg-[#4CAF50] text-white font-semibold hover:bg-[#388E3C] transition-colors duration-200 text-base sm:text-lg shadow-md active:scale-95 border-2 border-transparent hover:border-[#4CAF50] focus:border-[#388E3C]"
      >
        Zaloguj się
      </button>
    </form>
  );
}
