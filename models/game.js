const mongoose = require('mongoose');
const { format } = require('date-fns');
const Genre = require('../models/genre');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true },
  genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
  platforms: [
    {
      type: String,
      enum: ['Sony Playstation', 'Xbox', 'PC', 'Nintendo Switch'],
    },
  ],
  publisher: { type: Schema.Types.ObjectId, ref: 'Publisher' },
  developer: { type: Schema.Types.ObjectId, ref: 'Developer' },
  price: { type: Number, min: 0, required: true },
  stock: { type: Number, min: 0, required: true },
  releaseDate: { type: Date, required: true },
  cover: { type: String },
});

GameSchema.virtual('releaseDateFormatted').get(function () {
  return format(this.releaseDate, 'dd/MM/yyyy');
});

GameSchema.virtual('url').get(function () {
  return `/games/${this._id}`;
});

module.exports = mongoose.model('Game', GameSchema);
