const express = require('express');
const path = require('path');
const UserService = require('./user-service');


const userRouter = express.Router();
const bodyParser = express.json();

userRouter
  .post('/', bodyParser, async (req, res, next)=>{
    const { password, username, email} = req.body;

    for (const field of ['email', 'username', 'password'])
      if(!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    try {
      const passwordError = UserService.validatePassword(password);
      if(passwordError)
        return res.status(400).json({error: passwordError});

      const hasUserWithUserName = await UserService.hasUserWithUserName(
        req.app.get('db'), username);
      if (hasUserWithUserName)
        return res.status(400).json({error: 'username is taken'});

      const hasUserWithEmail = await UserService.hasUserWithEmail(
        req.app.get('db'), email);
      if (hasUserWithEmail)
        return res.status(400).json({error: 'This email has already been registered'});

      const hashedPassword = await UserService.hashPassword(password);
      const newUser = {
        username,
        password: hashedPassword,
        email,
        avatar: null
      };
      const user = await UserService.insertUser(
        req.app.get('db'),
        newUser
      );
      res.status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(UserService.serializeUser(user));
    } 
    catch(error){
      next(error);
    }
  });



module.exports = userRouter;