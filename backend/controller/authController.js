const crypto = require('crypto');
const { promisify } = require('util');
const User = require('./../models/userModel.js');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError.js');
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // console.log('Invalid Credentials');
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Please enter correct email or password', 401));
    // Implement a return next(ERROR HANDLER)
  }

  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // console.log('Im working!!');
  // Getting Token from User
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    // console.log(token);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
    console.log(token, 'cookie');
  }

  if (!token) {
    return next(new AppError('UnAuthorized!!!', 401));
    //Implement APP ERROR to stop next middleware from running!!!
  }

  // Token Verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  // Token generation Time and PasswordChange Time Comparison

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role, 'role');
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You donot have Permissions', 403));
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  console.log('Im here');
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user found', 404));
  }
  const resetToken = user.createPasswordTokenReset();
  await user.save({ validateBeforeSave: false });
  //Implement a way to send reset link

  return next(
    new AppError('There was an error sending the email. Try again later!'),
    500
  );
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now },
  });
  console.log('finish');

  if (!user) {
    return next(new AppError('Invalid Token', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();
  const token = signToken(user._id);
  res.status(200).json({
    status: 'sucess',
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  const token = signToken(user._id);
  res.status(200).json({
    status: 'sucess',
    token,
  });
});
