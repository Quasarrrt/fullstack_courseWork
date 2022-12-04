require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DBURL, limiter } = require('./config');

const { PORT = 3000 } = process.env;
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
mongoose.connect(DBURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(limiter);
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log('Сервер запущен');
});
