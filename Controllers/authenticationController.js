const User = require('../Models/userModel');
const catchAsync = require('../Utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../Utils/appError');
const sendEmail = require('../Utils/email');
// we only want promosify object from util so we have done destrucutring and taken promisify
// ES6 destrucuturing
const { promisify } = require('util');
require('dotenv').config();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ================================USER SIGNUP======================

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
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

// ===================================USER LOGIN================================
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

// ===================================PROTECT ROUTES=================
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1)Read the token from authorization hader
  // These are the conditions in which we actuall want to save the token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if the token actually exists
  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please login to continue access',
        401
      )
    );
  }
  // 2)Validate(Verification of) the token
  // if someone manipulated the data or aslo if token has already expired

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // 3)Check if user still exists
  // ex:what if user has changed his passwrd after the token has issued or if user doesn't exists

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The User Belonging to token does not exists', 401)
    );
  }

  // 4)Check if user changed password after token was issued
  // for this we'll create an instance method and that method is going to be available on all the documents or instancs
  // of the model and we do that in User model
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed the passowrd,Please login again', 401)
    );
  }

  // GRANT ACCESS TO THE PROTECTED ROUTE
  // lastly put entire user data on the request
  req.user = freshUser;
  next();
});

// ============================RESTRICT CERTAIN ROUTES EVEN IF USER lOGGED IN=====================

// actually we need to pass two arguments that is admin and lead-guide so instead of that we
// used ES6 spread operatior which takes any number of arguments
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ['admin','lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// =============================PASSWORD RESET ======================================

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1)Get user based on posted email
  // findone = because user doesn't know his own id
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  // 2) Generate a random token
  // for this we need to create another instance method on the user
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3)Send it back to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with ur new password and passwordConfirm to : ${resetURL}.\n If you didn't forget ur password please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token is valid for only 10 minutes',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!')
    );
  }
});

exports.resetPassword = (req, res, next) => {};
