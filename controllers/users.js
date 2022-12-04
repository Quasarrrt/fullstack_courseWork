const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../models/user');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const { JWT_SECRET } = require('../config');

const getUser = (req, res, next) => Users.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь с таким id не существует');
    }
    return res.status(200).send({ data: user });
  })
  .catch(next);

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const owner = req.user._id;
  return Users.findByIdAndUpdate(owner, { name, email }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError('Неправильная почта или пароль');
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      name, password: hash, email,
    }))
    .then((user) => res.status(201).send({ email: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Данные невалидны');
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      }
    })
    .catch(next);
};

module.exports = {
  createUser, updateUser, login, getUser,
};
