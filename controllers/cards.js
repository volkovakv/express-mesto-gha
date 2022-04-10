const { ERROR_CODE_REQUEST, ERROR_CODE_NOTFOUND, ERROR_CODE_DEFAULT } = require('../constants');

const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const allCards = await Card.find({});
    res.status(200).send(allCards);
  } catch (err) {
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректные данные карточки' });
    }
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
      _id: card._id,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERROR_CODE_NOTFOUND).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректный id карточки' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
      _id: card._id,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERROR_CODE_NOTFOUND).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректный id карточки' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
      _id: card._id,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERROR_CODE_NOTFOUND).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректный id карточки' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
      }
    });
};
