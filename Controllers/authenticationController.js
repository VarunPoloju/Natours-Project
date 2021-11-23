const User = require('../Models/userModel');
const catchAsync = require('../Utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../Utils/appError');
require('dotenv').config();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // creation of token
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      userData: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // or const {email,password} = req.body

  // 1)Check if email and password exists
  // if there is no email and password
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2)Check if user existence
  const user = await User.findOne({ email: email }).select('+password');
  // console.log(user);

  // If user does not exists or password is incorrect
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3)if everyting is ok, send JWT to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token: token,
  });
});
