const router = require('express').Router();
const {celebrate, Joi} = require("celebrate");
const {loginUser} = require("../controllers/users");

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), loginUser);

module.exports = router;