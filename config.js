require('dotenv').config();
const rateLimit = require('express-rate-limit');

const { JWT_SECRET = 'JWT_SECRET', DBURL = 'mongodb://localhost:27017/moviesdb' } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
module.exports = {
  JWT_SECRET,
  DBURL,
  limiter,
};
