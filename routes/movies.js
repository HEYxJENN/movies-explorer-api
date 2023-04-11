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
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().min(2).required().regex(URLregex),
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