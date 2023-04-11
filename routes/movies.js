const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { URLregex } = require('../constants/constants');

router.get('/movies', getMovies);

router.post(
  '/movies',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      country: Joi.string().required(),
      duration: Joi.required(),
      director: Joi.string().required(),
      year: Joi.required(),
      description: Joi.string().required(),
      image: Joi.required(),
      trailerLink: Joi.required(),
      thumbnail: Joi.required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie
);

router.delete(
  '/movies/:cardId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteMovie
);

module.exports = router;
