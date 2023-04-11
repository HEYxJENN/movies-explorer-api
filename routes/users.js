const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const { URLregex } = require('../constants/constants');
const {
  getUser,
  getUsers,
  updateUser,
  updateUseravatar,
  getMe,
} = require('../controllers/users');


router.get('/users/me', getMe);

router.patch(
  '/users/me',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUser
);

module.exports = router;