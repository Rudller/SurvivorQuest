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

// PUT /api/realizacje/:realizacjaId/game-templates/:gameId
router.put('/realizacje/:realizacjaId/game-templates/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const updated = await RealizacjaGra.findByIdAndUpdate(gameId, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Nie znaleziono gry realizacji.' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
