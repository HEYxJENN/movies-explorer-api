const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const { updateUser, getMe } = require('../controllers/users');

router.get('/users/me', getMe);

router.patch(
  '/users/me',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
    }),
  }),
  updateUser
);

module.exports = router;
