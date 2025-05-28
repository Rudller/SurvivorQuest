import logo from '../../../../packages/shared/assets/Logo-SurvivorQuest.png';
import LoginWindow from '../components/LoginWindow';
import ThemeToggle from '../components/ThemeToggle';

export default function LoginPage() {
  // Zwraca true jeśli logowanie się powiodło, false lub rzuca błąd jeśli nie
  const handleLogin = async (email, password) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Błąd logowania');
      }
      const data = await res.json();
      // Możesz tu zapisać token do localStorage/sessionStorage
      localStorage.setItem('token', data.token);
      return true;
    } catch (err) {
      throw err;
    }
  };

  return (
    <div
      className="bg-background dark:bg-background-dark min-h-screen w-screen flex items-center justify-center transition-colors duration-300 relative"
    >
      <ThemeToggle />
      {/* Logo jako tło z rozjaśnieniem w dark mode */}
      <div
        className="pointer-events-none select-none absolute top-4 left-1/2 -translate-x-1/2 z-0"
        style={{ width: 220, height: 220 }}
      >
        <img
          src={logo}
          alt="SurvivorQuest logo"
          className="w-full h-full object-contain drop-shadow-lg transition duration-300 brightness-100 dark:brightness-0 dark:invert"
          draggable="false"
        />
      </div>
      <div className="bg-primary dark:bg-primary-dark text-white dark:text-black p-8 rounded-2xl shadow-lg text-center w-full max-w-md flex flex-col items-center justify-center transition-colors duration-300 z-10 gap-4">
        <h1 className="text-3xl font-extrabold mb-2 tracking-wide text-accent dark:text-accent-dark drop-shadow select-none">Panel Admin</h1>
        <LoginWindow onLogin={handleLogin} />
        <p className="text-sm text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} SurvivorQuest
        </p>
      </div>
    </div>
  );
}
