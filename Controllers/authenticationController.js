const User = require('../Models/userModel');
const catchAsync = require('../Utils/catchAsync');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // creation of token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      userData: newUser,
    },
  });
});
