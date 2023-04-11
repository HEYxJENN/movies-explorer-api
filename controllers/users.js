const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');
const { CREATED } = require('../constants/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

// POST /signin (логин)
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return users
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        }
      );
      res.send({
        token,
      });
    })
    .catch((err) => {
      next(err);
    });
};

// GET users/me

module.exports.getMe = (req, res, next) => {
  users
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      next(err);
    });
};

// POST /signup — создаёт пользователя (регистрация)

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await users.create({
      email,
      password: hash,
      name,
    });
    user.password = undefined;
    res.status(CREATED).send({ data: user });
  } catch (err) {
    if (err.code === 11000) {
      next(new Conflict('email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new ValidationError('Ошибка валидации'));
    } else {
      next(err);
    }
  }
};

// PATCH users/me - обновление данных пользователя

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  users
    .findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    )
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь не найден'));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка валидации'));
      } else {
        next(err);
      }
    });
};
