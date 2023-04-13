const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors, Segments } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const moviesRouter = require('./routes/movies');
const usersRouter = require('./routes/users');
// const index = require('./routes/index');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const NotFound = require('./errors/NotFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const corsOptions = require('./constants/corsconfig');
const limiter = require('./constants/rateLimit');

require('dotenv').config();

const { NODE_ENV, DATABASE_URL, PORT } = process.env;

const app = express();
mongoose.connect(
  NODE_ENV === 'production'
    ? DATABASE_URL
    : 'mongodb://localhost:27017/bitfilmsdb',
  {}
);

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

// app.use(index)

app.post(
  '/signin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.post(
  '/signup',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.use(auth);

app.use('/', usersRouter);
app.use('/', moviesRouter);
app.use('/*', (req, res, next) => {
  next(new NotFound('Данный ресурс не найден'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.use(limiter); // limiter

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
