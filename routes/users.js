const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const { URLregex } = require('../constants/constants');
const { updateUser, getMe } = require('../controllers/users');

router.get('/users/me', getMe);

router.patch(
  '/users/me',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().regex(URLregex),
    }),
  }),
  updateUser
);

module.exports = router;
