const express = require('express');
const GameTemplate = require('../models/GameTemplate');

const router = express.Router();

// GET /api/game-templates
router.get('/game-templates', async (req, res) => {
  try {
    const gameTemplates = await GameTemplate.find({ aktywna: true });
    res.json(gameTemplates);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera.' });
  }
});

// POST /api/game-templates
router.post('/game-templates', async (req, res) => {
  try {
    const gameTemplate = new GameTemplate(req.body);
    await gameTemplate.save();
    res.status(201).json(gameTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/game-templates/:id
router.put('/game-templates/:id', async (req, res) => {
  try {
    const gameTemplate = await GameTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!gameTemplate) return res.status(404).json({ message: 'Nie znaleziono szablonu gry.' });
    res.json(gameTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
