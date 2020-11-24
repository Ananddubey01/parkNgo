const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// name,email,password,password confirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  profilePhoto: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'host', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a Password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
    message: 'Passwords doesnot match!!',
    // to implement confirmPassword === Password!!
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpire: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimeStamp);
    return JWTTimeStamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordTokenReset = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;
  console.log({ resetToken }, this.passwordResetToken);
  process.env.RESET_TOKEN.replace(
    '<RESETTOKEN>',
    resetToken
  );
  return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
