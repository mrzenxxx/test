const Movie = require('../models/movies');

const SomeWentWrongError = require('../errors/something-went-wrong-err');
const NotFoundError = require('../errors/not-found-err');
const AccessDeniedError = require('../errors/access-denied-err');

module.exports.getMovies = async (req, res) => {
  const movies = await Movie.find({})
    .where('owner').equals(req.user._id)
    .populate(['owner']);

  res.send(movies);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new SomeWentWrongError(`Некорректные данные: ${err}`));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм не найден');
    })
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        throw new AccessDeniedError('Данный фильм отсутствует у текущего пользователя');
      }

      return Movie.findByIdAndRemove(req.params.movieId)
        .then((deleteMovie) => res.send(deleteMovie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new SomeWentWrongError('Некорректный id'));
      } else {
        next(err);
      }
    });
};
