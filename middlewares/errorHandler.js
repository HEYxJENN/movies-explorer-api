module.exports = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const { message } = err;
  // console.log(statusCode, message);
  res
    .status(statusCode)
    .json({ message: statusCode === 500 ? 'Ошибка Сервера' : message });
  next();
};
