const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');
const DEVBASE = require('./constants/database');

const app = express();

const { PORT = 3000, DATABASE = DEVBASE } = process.env;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(auth);
app.use(errors());
app.use(errorLogger);

app.use('/signin', require('./routes/signin'));
app.use('/signup', require('./routes/signup'));
app.use('/movies', require('./routes/movies'));
app.use('/users', require('./routes/users'));

mongoose.connect(DATABASE, {});

app.use(() => {
  throw new NotFoundError('Такого роута не существует');
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(err.statusCode).send({ message });
  next();
});

app.listen(PORT);
