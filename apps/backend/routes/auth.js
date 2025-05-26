const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email });
  if (!email || !password) {
    return res.status(400).json({ message: 'Email i hasło są wymagane.' });
  }
  try {
    const user = await User.findOne({ email });
    console.log('User from DB:', user);
    if (!user || !user.isActive) {
      console.log('User not found or inactive');
      return res.status(401).json({ message: 'Nieprawidłowy email lub hasło.' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    console.log('Password valid:', valid);
    if (!valid) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Nieprawidłowy email lub hasło.' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'devsecret',
      { expiresIn: '12h' }
    );
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Błąd serwera.' });
  }
});

module.exports = router;
