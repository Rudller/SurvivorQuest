import Header from '../components/Header';

export default function Home() {
  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-background dark:bg-background-dark overflow-x-hidden">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8 text-black dark:text-white text-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-accent-dark">Instrukcja obsługi panelu admina SurvivorQuest</h1>
        <ol className="list-decimal list-inside space-y-3 text-base">
          <li>
            <span className="font-semibold">Menu boczne:</span> Kliknij ikonę burgera w lewym górnym rogu, aby otworzyć panel nawigacyjny. Znajdziesz tam sekcje: <b>Realizacje</b>, <b>Zarządzanie Grami</b> oraz <b>Instrukcje do stanowisk</b>.
          </li>
          <li>
            <span className="font-semibold">Dodawanie nowej realizacji:</span> Przejdź do sekcji <b>Realizacje</b> i kliknij przycisk „Dodaj nową realizację”. Wypełnij wymagane pola (nazwa firmy, data, lokalizacja, liczba drużyn, gry itd.) i zapisz.
          </li>
          <li>
            <span className="font-semibold">Zarządzanie grami:</span> W sekcji <b>Zarządzanie Grami</b> możesz przeglądać, edytować i dodawać gry, które będą przypisywane do realizacji.
          </li>
          <li>
            <span className="font-semibold">Instrukcje do stanowisk:</span> W tej sekcji znajdziesz instrukcje i materiały dla obsługi technicznej oraz prowadzących event.
          </li>
          <li>
            <span className="font-semibold">Zmiana motywu:</span> Użyj przełącznika po prawej stronie nagłówka, aby zmienić tryb jasny/ciemny.
          </li>
          <li>
            <span className="font-semibold">Wylogowanie:</span> Opcja wylogowania dostępna jest w menu użytkownika lub w panelu bocznym (jeśli zostanie dodana).
          </li>
        </ol>
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
          W razie problemów lub pytań skontaktuj się z administratorem systemu.<br />
          Panel jest w fazie rozwoju – niektóre funkcje mogą być niedostępne.
        </div>
      </div>
    </div>
  );
}
