const jwt = require('jsonwebtoken');

const AuthError = require('../errors/auth-err');

const SECRET_KEY_DEV = 'd285e3dceed844f902650f40';

require('dotenv').config();

let secret = SECRET_KEY_DEV;

if (process.env.NODE_ENV === 'production') {
  secret = process.env.JWT_SECRET;
}

if (!secret && process.env.NODE_ENV === 'production') {
  throw new Error('Для работы сервера в production режиме необходимо указать JWT_SECRET.');
}

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (req.path === '/signin' || req.path === '/signup') {
    return next()
  };

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Необходима авторизация'));

    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
