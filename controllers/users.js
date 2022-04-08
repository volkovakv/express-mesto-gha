/* eslint-disable function-paren-newline */
/* eslint-disable arrow-parens */
const User = require('../models/user');

module.exports.createUser = async (req, res) => {
  const ERROR_CODE_REQUEST = 400;
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(201).send(user);
  } catch (err) {
    res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректные данные пользователя' });
  }
};

module.exports.getUser = async (req, res) => {
  const ERROR_CODE_NOTFOUND = 404;
  const ERROR_CODE_DEFAULT = 500;
  try {
    const userItem = await User.findById(req.params.userId);
    if (userItem) {
      res.status(200).send(userItem);
    } else {
      res.status(ERROR_CODE_NOTFOUND).send({ message: 'Пользователь не найден' });
    }
  } catch (err) {
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports.getAllUsers = async (req, res) => {
  const ERROR_CODE_DEFAULT = 500;
  try {
    const allUsers = await User.find({});
    res.status(200).send(allUsers);
  } catch (err) {
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports.updateUser = async (req, res) => {
  const ERROR_CODE_REQUEST = 400;
  const ERROR_CODE_DEFAULT = 500;
  try {
    const { name, about } = req.body;
    const userForUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    if (userForUpdate) {
      res.status(200).send(userForUpdate);
    } else {
      res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректные данные пользователя' });
    }
  } catch (err) {
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  const ERROR_CODE_REQUEST = 400;
  const ERROR_CODE_DEFAULT = 500;
  try {
    const { avatar } = req.body;
    const userForUpdateAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    if (userForUpdateAvatar) {
      res.status(201).send(userForUpdateAvatar);
    } else {
      res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректные данные пользователя' });
    }
  } catch (err) {
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
  }
};
