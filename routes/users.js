/* eslint-disable object-curly-newline */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
const usersRouter = require('express').Router();

const { createUser, getUser, getAllUsers, updateUser, updateUserAvatar } = require('../controllers/users');

usersRouter.post('/users', createUser);
usersRouter.get('/users/:userId', getUser);
usersRouter.get('/users', getAllUsers);
usersRouter.patch('/users/me', updateUser);
usersRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = usersRouter;
