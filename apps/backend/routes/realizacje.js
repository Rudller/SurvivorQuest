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

// GET /api/realizacje/:id
router.get('/realizacje/:id', async (req, res) => {
  try {
    const realizacja = await Realizacja.findById(req.params.id);
    if (!realizacja) {
      return res.status(404).json({ message: 'Nie znaleziono realizacji.' });
    }
    res.json(realizacja);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera.' });
  }
});

// PUT /api/realizacje/:id
router.put('/realizacje/:id', async (req, res) => {
  try {
    const realizacja = await Realizacja.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!realizacja) {
      return res.status(404).json({ message: 'Nie znaleziono realizacji.' });
    }
    res.json(realizacja);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: 'Błąd serwera.' });
  }
});

module.exports = router;
