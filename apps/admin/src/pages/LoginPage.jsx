import logo from '../../../../packages/shared/assets/Logo-SurvivorQuest.png';
import LoginWindow from '../components/LoginWindow';

export default function LoginPage() {
  const handleLogin = (email, password) => {
    // TODO: Integracja z backendem
    alert(`Zalogowano jako: ${email}`);
  };

  return (
    <div
      className="bg-background dark:bg-background-dark min-h-screen w-screen flex items-center justify-center transition-colors duration-300"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 4rem',
        backgroundSize: '220px',
      }}
    >
      <div className="bg-primary dark:bg-primary-dark text-white dark:text-black p-8 rounded-2xl shadow-lg text-center w-full max-w-md flex flex-col items-center justify-center transition-colors duration-300">
        <LoginWindow onLogin={handleLogin} />
      </div>
    </div>
  );
}
