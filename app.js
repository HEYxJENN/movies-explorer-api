const express = require('express');
const rateLimit = require('express-rate-limit'); // limiter
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors, Segments } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const moviesRouter = require('./routes/movies');
const usersRouter = require('./routes/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const NotFound = require('./errors/NotFound');
// const { URLregex } = require('./constants/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const corsOptions = require('./constants/corsconfig');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/movies', {});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter); // limiter
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

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
      name: Joi.string().min(2).max(30),
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

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
