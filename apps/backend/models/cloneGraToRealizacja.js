const GameTemplate = require('./GameTemplate');
const RealizacjaGra = require('./RealizacjaGra');
const { v4: uuidv4 } = require('uuid');

/**
 * Klonuje szablon gry (GameTemplate) do realizacji jako osobny dokument RealizacjaGra
 * @param {string|ObjectId} graId - ID szablonu gry (GameTemplate)
 * @param {string|ObjectId} realizacjaId - ID realizacji
 * @param {object} overrides - Nadpisania pól (instrukcja, obrazek, punktacja, gps, itp.)
 * @returns {Promise<RealizacjaGra>} Nowy dokument RealizacjaGra
 */
async function cloneGraToRealizacja(graId, realizacjaId, overrides = {}) {
  const graSzablon = await GameTemplate.findById(graId);
  if (!graSzablon) throw new Error('Nie znaleziono szablonu gry (GameTemplate)');

  // Unikalny QR (możesz podmienić na własny generator)
  const qrCode = overrides.qrCode || uuidv4();

  const nowaGra = new RealizacjaGra({
    realizacjaId,
    graSzablonId: graSzablon._id,
    instrukcja: overrides.instrukcja || graSzablon.instrukcja || '',
    obrazek: overrides.obrazek || null,
    punktacja: typeof overrides.punktacja === 'number' ? overrides.punktacja : 100,
    typ: overrides.typ || graSzablon.typ,
    qrCode,
    gps: overrides.gps || undefined,
  });

  return await nowaGra.save();
}

module.exports = { cloneGraToRealizacja };
