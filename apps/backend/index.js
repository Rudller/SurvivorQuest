require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/auth');
const realizacjeRouter = require('./routes/realizacje');
const gameTemplateRouter = require('./routes/gameTemplate');
const realizacjaGraRouter = require('./routes/realizacjagra');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('SurvivorQuest backend API is running!');
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/api', authRouter);
app.use('/api', realizacjeRouter);
app.use('/api', gameTemplateRouter);
app.use('/api', realizacjaGraRouter);

// TODO: Add routes for users, games, tasks, etc.

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
