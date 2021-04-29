const Articles = require('../models/article');
const NotFoundError = require('../Error/NotFoundError');
const UnauthorizedError = require('../Error/UnauthorizedError');

const getArticles = (req, res, next) => {
  Articles.find({})
    .then((all) => res.send(all))
    .catch(next);
};

const createArticle = (req, res, next) => {
  Articles.create({ ...req.body, owner: req.user._id })
    .then((article) => res.send(article))
    .catch(next);
};

const deleteArticle = async (req, res, next) => {
  try {
    const ownerId = await Articles.ownerId(req.params.articleId);
    return String(ownerId) === req.user._id
      ? Articles.findByIdAndDelete(req.params.articleId)
        .then(() => res.send({ message: 'Article Deleted' }))
      : next({ statusCode: 403, message: 'User Not Allowed' });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getArticles, createArticle, deleteArticle };
