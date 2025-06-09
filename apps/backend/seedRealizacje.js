// Skrypt do seedowania przykładowych realizacji wraz z przypisaniem gier
// Uruchom: node apps/backend/seedRealizacje.js

const mongoose = require('mongoose');
const Realizacja = require('./models/Realizacja');
const GameTemplate = require('./models/GameTemplate');
const RealizacjaGra = require('./models/RealizacjaGra');
const { cloneGraToRealizacja } = require('./models/cloneGraToRealizacja');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/survivorquest';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Połączono z bazą.');

  // Usuń stare realizacje i gry przypisane do realizacji
  await Realizacja.deleteMany({});
  await RealizacjaGra.deleteMany({});

  // Pobierz szablony gier
  const szablony = await GameTemplate.find();
  if (szablony.length < 3) {
    throw new Error('Za mało szablonów gier w bazie. Najpierw dodaj szablony.');
  }

  // Przykładowe realizacje
  const realizacje = [
    {
      nazwaFirmy: 'Firma Alfa',
      lokalizacja: 'Warszawa',
      startDate: new Date('2025-06-10'),
      status: 'zaplanowana',
      opis: 'Integracja letnia',
      iloscDruzyn: 4,
      utworzonaPrzez: szablony[0]._id, // przykładowo, podmień na prawdziwego usera jeśli trzeba
    },
    {
      nazwaFirmy: 'Beta Sp. z o.o.',
      lokalizacja: 'Kraków',
      startDate: new Date('2025-07-01'),
      status: 'aktywna',
      opis: 'Wyjazd motywacyjny',
      iloscDruzyn: 3,
      utworzonaPrzez: szablony[0]._id,
    },
    {
      nazwaFirmy: 'Gamma Team',
      lokalizacja: 'Gdańsk',
      startDate: new Date('2025-08-15'),
      status: 'zakończona',
      opis: 'Event outdoor',
      iloscDruzyn: 5,
      utworzonaPrzez: szablony[0]._id,
    },
    {
      nazwaFirmy: 'Delta Group',
      lokalizacja: 'Poznań',
      startDate: new Date('2025-09-05'),
      status: 'zaplanowana',
      opis: 'Team building',
      iloscDruzyn: 2,
      utworzonaPrzez: szablony[0]._id,
    },
  ];

  for (const r of realizacje) {
    const realizacja = await Realizacja.create(r);
    // Przypisz 2-3 gry do każdej realizacji
    const gryDoPrzypisania = szablony.slice(0, Math.floor(Math.random() * 2) + 2); // 2 lub 3 gry
    for (const szablon of gryDoPrzypisania) {
      await cloneGraToRealizacja(szablon._id, realizacja._id);
    }
    console.log(`Dodano realizację: ${realizacja.nazwaFirmy}`);
  }

  await mongoose.disconnect();
  console.log('Zakończono seedowanie.');
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
