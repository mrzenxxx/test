const mongoose = require('mongoose');
const validator = require('validator');

const MovieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  trailerLink: {
    type: String,
    required: true,
  },

  thumbnail: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: false,
  },

  movieId: {
    type: Number,
    required: true,
    unique: true,
  },

  nameRU: {
    type: String,
    required: true,
    unique: true,
  },

  nameEN: {
    type: String,
    required: true,
    unique: true,
  },

});

MovieSchema.path('image').validate((link) => validator.isURL(link), 'Некорректный URL');
MovieSchema.path('thumbnail').validate((link) => validator.isURL(link), 'Некорректный URL');
MovieSchema.path('trailerLink').validate((link) => validator.isURL(link), 'Укажите ссылку на фильм');

// eslint-disable-next-line new-cap
module.exports = new mongoose.model('movie', MovieSchema);
