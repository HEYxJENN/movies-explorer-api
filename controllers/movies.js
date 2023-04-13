// const crypto = require('crypto');
const Movies = require('../models/movie');
const NotFound = require('../errors/NotFound');
const ForbidddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');
const {
  OK,
  BAD_REQUEST_ERROR,
  BAD_REQUEST_MESSAGE,
} = require('../constants/constants');

// Get получаем все сохраненные пользователем фильмы

module.exports.getMovies = (req, res, next) => {
  const ownerId = req.user._id;
  Movies.find({ owner: ownerId })
    .then((movies) => res.status(OK).send({ data: movies }))
    .catch((err) => next(err));
};

// Post создание фильма

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const ownerId = req.user._id;
  // movieID был генерируемым, мне показалось, что странно его вводить вручную
  // const movieIdg = crypto.randomBytes(16).toString('hex');
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: ownerId,
    // movieId: movieIdg,
  })
    // не уверен в каком виде должен быть пользовтаель айди или объект
    // .populate('owner')
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError')
        res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
      else {
        next(err);
      }
    });
};

// Delete удаление фильма

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const card = await Movies.findById(req.params.cardId);
    if (!card) {
      throw new NotFound('Movie не найден');
    }
    if (card.owner.toString() !== req.user._id) {
      throw new ForbidddenError('Нет Доступа');
    }
    await Movies.findByIdAndDelete(req.params.cardId);
    res.status(OK).send({ data: card });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Невалидный id'));
    } else {
      next(err);
    }
  }
};

// тест запрос
// {
// "country":"rus",
// "director":"hz",
// "duration":"126",
// "year":"2000",
// "description":"Greatest",
// "image":"http://examples.com",
// "trailerLink":"http://examples.com",
// "thumbnail":"http://examples.com",
// "nameRU":"Green Elephant2",
// "nameEN":"Зеленый Слоник2"
// }
