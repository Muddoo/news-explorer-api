const mongoose = require('mongoose');
const validator = require('validator');
const NotFoundError = require('../Error/NotFoundError');

const schema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true }),
      message: () => 'Must be a Valid URL',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true }),
      message: () => 'Must be a Valid URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

schema.statics.ownerId = function isOwner(id) {
  return this.findOne({ _id: id })
    .select('+owner')
    .then((article) => {
      if (!article) return Promise.reject(new NotFoundError('Article Not Found'));
      return article.owner;
    })
    .catch((err) => Promise.reject({ statusCode: err.statusCode || 400, message: err.message }));
};

module.exports = mongoose.model('article', schema);
