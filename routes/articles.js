const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controller/articles');

router.get('/', getArticles);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().uri(),
    image: Joi.string().required().uri(),
  }).unknown(false),
}), createArticle);

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().required().length(24),
  }),
}), deleteArticle);

module.exports = router;
