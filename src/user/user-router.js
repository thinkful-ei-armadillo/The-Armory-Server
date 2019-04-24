const express = require('express');
const path = require('path');
const UserService = require('./user-service');


const userRouter = express.Router();
const bodyParser = express.json();

userRouter
  .post('/', bodyParser, async (req, res, next)=>{
    
  })