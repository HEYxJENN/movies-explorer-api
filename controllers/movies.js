const Cards = require('../models/movie');
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
  Cards.find({})
    // .populate('owner')
    // .populate('likes')
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch((err) => next(err));
};

// Post создание карточки

module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Cards.create({ name, link, owner: ownerId })
    // .populate('owner')
    // .populate('likes')
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
    const card = await Cards.findById(req.params.cardId);
    if (!card) {
      throw new NotFound('Movie не найден');
    }
    if (card.owner.toString() !== req.user._id) {
      throw new ForbidddenError('Нет Доступа');
    }
    await Cards.findByIdAndDelete(req.params.cardId);
    res.status(OK).send({ data: card });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Невалидный id'));
    } else {
      next(err);
    }
  }
};
