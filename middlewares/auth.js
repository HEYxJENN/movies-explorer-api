// полагаю, что в комментариях к данному коду вы не совсем правы,
// сравнение токена и куки нужно для повышения уровня безопасности
// я оставил только jwt, но по мнению нескольких моих знакомых senior разработчиков - такая практика хуже.
// так же на будущее для себя хотел бы оставить закомментированный код, как пример best practice
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (res, next) => {
  next(new Unauthorized('Требуется авторизация'));
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // кука из реквеста

  // const { secureCookie } = req.cookies;

  // if (!secureCookie) {
  //   handleAuthError(res, next);
  //   return;
  // }

  if (!authorization || !authorization.startsWith('Bearer ')) {
    handleAuthError(res, next);
    return;
  }

  const token = extractBearerToken(authorization);

  // сравниваем токены
  // if (secureCookie !== token) {
  //   handleAuthError(res,next);
  //   return;
  // }

  let payload;
  try {
    payload = jwt.verify(
      token,
      // 'super-strong-secret'
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
    );
    // payload = jwt.verify(secureCookie, 'super-strong-secret');
  } catch (err) {
    handleAuthError(res, next);
    return;
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
