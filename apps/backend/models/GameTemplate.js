const mongoose = require('mongoose');
const { Schema } = mongoose;

const GameTemplateSchema = new Schema(
  {
    nazwa: {
      type: String,
      required: true,
      trim: true,
    },
    instrukcja: {
      type: String,
      trim: true,
      required: true,
    },
    obrazek: {
      type: String,
      trim: true,
    },
    punktacja: {
      type: Number,
      default: 100,
    },
    typ: {
      type: String,
      enum: ['terenowa', 'logiczna', 'znajdźka', 'inna'],
      default: 'terenowa',
    },
    czasTrwania: {
      type: Number, // w minutach
      default: 0,
    },
    aktywna: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model('GameTemplate', GameTemplateSchema);
