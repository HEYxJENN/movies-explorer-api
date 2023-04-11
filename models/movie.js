const mongoose = require('mongoose');
const validator = require('validator');
// const { URLregex } = require('../constants/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  year: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: (value) => `${value} - некорректная ссылка`,
    },
  },

  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: (value) => `${value} - некорректная ссылка`,
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: (value) => `${value} - некорректная ссылка`,
    },
  },

  owner: {
    // type: mongoose.Schema.Types.ObjectId,
    type: String,
    // required: true,
    // ref: 'user',
  },

  movieId: {
    // type: mongoose.Schema.Types.ObjectId,
    type: String,
    // required: true,
  },

  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('movie', movieSchema);
