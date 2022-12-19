const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET_KEY_DEV = 'd285e3dceed844f902650f40';

const NotFoundError = require('../errors/not-found-err');
const SomeWentWrongError = require('../errors/something-went-wrong-err');
const AuthError = require('../errors/auth-err');
const UsedEmailError = require('../errors/used-email-err');

require('dotenv').config();

let secret = SECRET_KEY_DEV;

if (process.env.NODE_ENV === 'production') {
  secret = process.env.JWT_SECRET;
}

if (!secret && process.env.NODE_ENV === 'production') {
  throw new Error('Для работы сервера в production режиме необходимо указать JWT_SECRET.');
}

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new SomeWentWrongError('Некорректный id'));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then(() => res.status(200).send({
        data: {
          name, email,
        },
      }))
      .catch((err) => {
        if (err.code === 409) {
          next(new UsedEmailError('Email уже используется'));
        } else if (err.name === 'ValidationError') {
          next(new SomeWentWrongError('Некорректные данные'));
        } else {
          next(err);
        }
      }))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new SomeWentWrongError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  let saveUser = {};

  User.findOne({ email }).select('+password')
    .then((user) => {
      saveUser = user;
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new AuthError('Неправильные почта или пароль');
      }

      const token = jwt.sign({ _id: saveUser._id }, secret, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
