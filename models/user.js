const mongoose = require('mongoose');
const validator = require('validator');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    select: false,
  }
}, { versionKey: false })

module.exports = mongoose.model('user', schema);