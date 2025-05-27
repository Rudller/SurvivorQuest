const mongoose = require('mongoose');
const { Schema } = mongoose;

const GraSchema = new Schema(
  {
    nazwa: {
      type: String,
      required: true,
      trim: true,
    },
    opis: {
      type: String,
      trim: true,
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
    dodatkoweUstawienia: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model('Gry', GraSchema);
