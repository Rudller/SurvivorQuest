const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const RealizacjaSchema = new Schema(
  {
    nazwaFirmy: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    lokalizacja: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['zaplanowana', 'aktywna', 'zakończona'],
      default: 'zaplanowana',
    },
    opis: {
      type: String,
      trim: true,
    },
    iloscDruzyn: {
      type: Number,
      min: 1,
      required: true,
    },
    gry: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Gry',
      },
    ],
    utworzonaPrzez: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

module.exports = mongoose.model('Realizacja', RealizacjaSchema);
