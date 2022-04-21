const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ExistEmailError = require('../error/ExistEmailError');
const IdError = require('../error/IdError');
const NotFoundError = require('../error/NotFoundError');
const RequestError = require('../error/RequestError');

const User = require('../models/user');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret1993key',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch(() => {
      next(new IdError('Ошибка авторизации: неправильная почта или логин'));
    });
};

module.exports.getMe = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (user) {
      res.status(200).send({ data: user });
    } else {
      throw new NotFoundError('Пользователь не найден');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new RequestError('Некорректный id пользователя'));
    } else {
      next(err);
    }
  }
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    next(new RequestError('Не переданы email или пароль'));
  }
  bcrypt
    .hash(password, 15)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ExistEmailError('Пользователь с таким email зарегистрирован'));
      }
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь не найден'));
      } else if (err.name === 'CastError') {
        next(new RequestError('Некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.getAllUsers = async (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь не найден'));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new RequestError('Некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь не найден'));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new RequestError('Некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};
