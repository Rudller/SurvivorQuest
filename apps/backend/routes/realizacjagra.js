const express = require('express');
const RealizacjaGra = require('../models/RealizacjaGra');
const { cloneGraToRealizacja } = require('../models/cloneGraToRealizacja');

const router = express.Router();

// POST /api/realizacje/:realizacjaId/game-templates
router.post('/realizacje/:realizacjaId/game-templates', async (req, res) => {
  try {
    const { graId, instrukcja, obrazek, punktacja, kolejnosc, gps, qrCode } = req.body;
    const { realizacjaId } = req.params;
    const nowaGra = await cloneGraToRealizacja(graId, realizacjaId, {
      instrukcja, obrazek, punktacja, kolejnosc, gps, qrCode
    });
    res.status(201).json(nowaGra);
  } catch (err) {
    console.error('Błąd klonowania szablonu gry do realizacji:', err);
    res.status(400).json({ message: err.message });
  }
});

// GET /api/realizacje/:realizacjaId/game-templates
router.get('/realizacje/:realizacjaId/game-templates', async (req, res) => {
  try {
    const { realizacjaId } = req.params;
    const gameTemplates = await RealizacjaGra.find({ realizacjaId });
    res.json(gameTemplates);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera.' });
  }
});

module.exports = router;
