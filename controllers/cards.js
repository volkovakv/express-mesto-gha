/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  const ERROR_CODE_DEFAULT = 500;
  try {
    const allCards = await Card.find({});
    res.status(200).send(allCards);
  } catch (err) {
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports.createCard = async (req, res) => {
  const ERROR_CODE_REQUEST = 400;
  console.log(req.user._id);
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(201).send(card);
  } catch (err) {
    res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректные данные карточки' });
  }
};

module.exports.deleteCard = async (req, res) => {
  const ERROR_CODE_NOTFOUND = 404;
  const ERROR_CODE_DEFAULT = 500;
  try {
    const cardForDelete = await Card.findByIdAndRemove(req.params.cardId);
    if (Card) {
      res.status(200).send({ data: cardForDelete });
    } else {
      res.status(ERROR_CODE_NOTFOUND).send({ message: 'Карточка не найдена' });
    }
  } catch (err) {
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports.likeCard = async (req, res) => {
  const ERROR_CODE_REQUEST = 400;
  const ERROR_CODE_DEFAULT = 500;
  try {
    const likeCard = Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (likeCard) {
      res.status(201).send(likeCard);
    } else {
      res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректные данные карточки' });
    }
  } catch (err) {
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  const ERROR_CODE_REQUEST = 400;
  const ERROR_CODE_DEFAULT = 500;
  try {
    const cardDislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (cardDislike) {
      res.status(201).send(cardDislike);
    } else {
      res.status(ERROR_CODE_REQUEST).send({ message: 'Некорректные данные карточки' });
    }
  } catch (err) {
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка сервера' });
  }
};
