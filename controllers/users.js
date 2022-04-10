const { ERROR_CODE_REQUEST, ERROR_CODE_NOTFOUND, ERROR_CODE_DEFAULT } = require('../constants');

const User = require('../models/user');

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректные данные пользователя' });
    }
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports.getUser = (req, res) => {
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
        res.status(ERROR_CODE_NOTFOUND).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректные данные пользователя' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).send(allUsers);
  } catch (err) {
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports.updateUser = (req, res) => {
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
        res.status(ERROR_CODE_NOTFOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректные данные пользователя' });
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
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
        res.status(ERROR_CODE_NOTFOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректные данные пользователя' });
      }
    });
};
