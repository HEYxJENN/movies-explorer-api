const crypto = require('crypto');
const Movies = require('../models/movie');
const NotFound = require('../errors/NotFound');
const ForbidddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');
const {
  OK,
  BAD_REQUEST_ERROR,
  BAD_REQUEST_MESSAGE,
} = require('../constants/constants');

// Get получаем все карты

module.exports.getMovies = (req, res, next) => {
  Movies.find({})
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch((err) => next(err));
};

// Post создание карточки

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
    nameRU,
    nameEN,
  } = req.body;
  const ownerId = req.user._id;
  const movieIdg = crypto.randomBytes(16).toString('hex');
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    owner: ownerId,
    movieId: movieIdg,
  })
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

// Delete удаление
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
//   "country":"rus",
//       "director":"hz",
//     "duration":"126",
//      "year":"2000x",
//       "description":"greatest",
//        "image":"aaa.ru",
//         "trailerLink":"bbb.ru",
//          "thumbnail":"ccc.ru",
//           "nameRU":"Green Elephant",
//                     "nameEN":"Зеленый Слоник"
//   }
