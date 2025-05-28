const express = require('express');
const Gry = require('../models/Gry');

const router = express.Router();

// GET /api/gry
router.get('/gry', async (req, res) => {
  try {
    const gry = await Gry.find({ aktywna: true });
    res.json(gry);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera.' });
  }
});

module.exports = router;
