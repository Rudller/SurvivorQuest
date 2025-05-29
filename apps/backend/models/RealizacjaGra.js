const mongoose = require('mongoose');
const { Schema } = mongoose;

const RealizacjaGraSchema = new Schema(
  {
    realizacjaId: {
      type: Schema.Types.ObjectId,
      ref: 'Realizacja',
      required: true,
    },
    graSzablonId: {
      type: Schema.Types.ObjectId,
      ref: 'GameTemplate', // oryginalny szablon
      required: true,
    },
    instrukcja: {
      type: String,
      required: true,
    },
    obrazek: {
      type: String, // URL do grafiki
    },
    qrCode: {
      type: String,
      unique: true,
      required: true,
    },
    punktacja: {
      type: Number,
      default: 100,
    },
    typ: {
      type: String,
      enum: ['terenowa', 'logiczna', 'znajdźka', 'inna'],
    },
    gps: {
      lat: Number,
      lng: Number,
      radius: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RealizacjaGra', RealizacjaGraSchema);
