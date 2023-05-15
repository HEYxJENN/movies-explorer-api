const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({

email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: (v) => validator.isEmail(v),
          message: (value) => `${value} - некорректный email`,
        },
      },


  password: {
    type: String,
    required: true,
    select: false,
  },


  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  }

}
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new Unauthorized('Неправильные почта или пароль');
        }
        return user;
      });
    });
};

module.exports = mongoose.model('users', userSchema);
