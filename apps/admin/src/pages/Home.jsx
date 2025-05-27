import Header from '../components/Header';

export default function Home() {
  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-background dark:bg-background-dark overflow-x-hidden">
      <Header />
      <div className="flex items-center dark:text-white text-black justify-center min-h-[calc(100vh-64px)] text-2xl">
        Witaj w panelu admina!
      </div>
    </div>
  );
}
