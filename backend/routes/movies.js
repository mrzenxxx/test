const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
// const linkRule = require('../constants/link-rule');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    nameEN: Joi.string().required().min(2).max(30),
    nameRU: Joi.string().required().min(2).max(30),
    country: Joi.string().required().min(2).max(20),
    movieId: Joi.number().required().min(1).max(11111111),
    director: Joi.string().required().min(2).max(20),
    duration: Joi.number().required().min(1).max(11111111),
    year: Joi.number().required().min(1900).max(2022),
    description: Joi.string().required().min(2).max(3333),
    image: Joi.string().required().min(2).max(222),
    trailerLink: Joi.string().required().min(2).max(222),
    thumbnail: Joi.string().required().min(2).max(222),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
