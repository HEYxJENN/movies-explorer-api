const corsOptions = {
  origin: [
    "http://ohheyfront.nomoredomains.work/",
    "http://localhost/",
    "http://localhost:3000/",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = corsOptions;
