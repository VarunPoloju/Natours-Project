const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us ur name'],
  },
  email: {
    type: 'String',
    required: [true, 'Please provide ur email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    // enum --  to alow only specified types
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
    required: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm ur password'],
    validate: {
      validator: function (ele) {
        // only works on CREATE & SAVE!!! ex:-   const newUser = await User.create(req.body);
        // if return value is false we'll get validation error
        return ele === this.password; //abc(ele) === abc(this.passsword)
      },
      message: 'Passwords are not same',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  // if password is modified -> only run this function
  if (!this.isModified('password')) return next();

  //  with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // after changing password delete the confirm passwod coz no use
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // returns false means the user has not changed the password
  // if true--> password changed
  if (this.passwordChangedAt) {
    // console.log(this.passwordChangedAt);
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp; //300(token issued at) < 200 (password changed at) false so goes to next password not changed
  }
  // false means passowrd not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
