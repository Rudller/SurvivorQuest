const express = require('express');
const Realizacja = require('../models/Realizacja');

const router = express.Router();

// GET /api/realizacje
router.get('/realizacje', async (req, res) => {
  try {
    const realizacje = await Realizacja.find();
    res.json(realizacje);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera.' });
  }
});

// POST /api/realizacje
router.post('/realizacje', async (req, res) => {
  try {
    const realizacja = new Realizacja(req.body);
    await realizacja.save();
    res.status(201).json(realizacja);
  } catch (err) {
    console.error('Realizacja validation error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(400).json({ message: 'Błąd walidacji lub serwera.' });
  }
});

module.exports = router;
