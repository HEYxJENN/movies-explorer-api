const { JWT_SECRET = "JWT_SECRET" } = process.env;
const { DB_ADDRESS = " mongodb://127.0.0.1/mestodb" } = process.envy;

module.exports = {
  JWT_SECRET,
  DB_ADDRESS,
};
