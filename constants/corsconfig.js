const corsOptions = {
  origin: [
    'http://localhost',
    'http://localhost:3000',
    'https://heymovies.nomoredomains.monster',
    'http://heymovies.nomoredomains.monster',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

module.exports = corsOptions;
