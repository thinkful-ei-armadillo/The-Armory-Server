const express = require('express');
const path = require('path');
const UserService = require('./user-service');
const { requireAuth } = require('../middleware/jwt-auth');

const userRouter = express.Router();
const bodyParser = express.json();

userRouter.post('/', bodyParser, async (req, res, next) => {
  const { password, username, email } = req.body;

  for (const field of ['email', 'username', 'password'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });
  try {
    const passwordError = UserService.validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const hasUserWithUserName = await UserService.hasUserWithUserName(
      req.app.get('db'),
      username
    );
    if (hasUserWithUserName)
      return res.status(400).json({ error: 'username is taken' });

    const hasUserWithEmail = await UserService.hasUserWithEmail(
      req.app.get('db'),
      email
    );
    if (hasUserWithEmail)
      return res
        .status(400)
        .json({ error: 'This email has already been registered' });

    const hashedPassword = await UserService.hashPassword(password);
    const newUser = {
      username: username,
      password: hashedPassword,
      email,
      avatar_url: ''
    };
    const user = await UserService.insertUser(req.app.get('db'), newUser);
    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${user.id}`))
      .json(UserService.serializeUser(user));
  } catch (error) {
    next(error);
  }
});

userRouter.get('/:userId', bodyParser, async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const userInfo = await UserService.getUserInfo(req.app.get('db'), userId);
    if (!userInfo)
      return res.status(404).json({
        error: 'User does not exist'
      });
    res.json({ userInfo });
    next();
  } catch (error) {
    next(error);
  }
});

userRouter.patch(
  '/:userId', requireAuth, bodyParser, async (req, res, next) => {
    const userId = req.params.userId;
    const { password, email, avatar_url } = req.body;
    const updates = {};
    try {
      if(!password && !email && !avatar_url){
        return res.status(400).json({
          error: 'Nothing to update'});}
      if (password) {
        const hashedPassword = await UserService.hashPassword(password);
        updates.password = hashedPassword; }
      if (email) { 
        updates.email = email; }
      if (avatar_url) { 
        updates.avatar_url = avatar_url; }

      const user = await UserService.updateUser(
        req.app.get('db'),
        userId,
        updates
      );
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json({updates});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = userRouter;
