const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

UserSchema.path('email').validate((email) => validator.isEmail(email), 'Некорректный email');

// eslint-disable-next-line new-cap
module.exports = new mongoose.model('user', UserSchema);
