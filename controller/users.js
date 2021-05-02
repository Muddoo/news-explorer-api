const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const NotFoundError = require('../Error/NotFoundError');
const UnauthorizedError = require('../Error/UnauthorizedError');

const getUser = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => new NotFoundError('Not Found'))
    .then((user) => {
      const { _doc: { password, ...props } } = user;
      res.send({ data: props });
    })
    .catch(next);
};

const createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    Users.create({ ...req.body, password: hash })
      .then((user) => {
        const { _doc: { password, ...props } } = user;
        res.send({ data: props });
      })
      .catch((err) => next({ statusCode: 409, message: err.message }));
  } catch (err) {
    next(err);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  Users.findOne({ email })
    .orFail(() => new UnauthorizedError('Incorrect password or email'))
    .select('+password')
    .then(async (user) => {
      const match = await bcrypt.compare(password, user.password);
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      return match
        ? res.send({ token })
        : Promise.reject(new UnauthorizedError('Incorrect password or email'));
    })
    .catch(next);
};

module.exports = { getUser, createUser, login };
