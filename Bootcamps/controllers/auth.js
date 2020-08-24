const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password: password,
    role,
  });

  // get user
  // var user = new User(req.body);
  // user.hash_password = bcrypt.hashSync(req.body.password, 10);
  // user.password = user.hash_password;
  // // save
  // user.save(function (err, newUser) {
  //   console.log(newUser);
  //   if (err) {
  //     res.json({ code: false, message: 'Error to save' });
  //     return;
  //   }
  //   newUser.hash_password = undefined;
  //   res.json({ message: 'Save ok', data: newUser });
  // });

  sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  // User.findOne({ email }, async (error, user) => {
  //   const isMatch = await user.matchPassword(password);

  //   if (!user) {
  //     return next(new ErrorResponse(error.message), 401);
  //   } else if (!isMatch) {
  //     return next(new ErrorResponse('Invalid credentials'), 401);
  //   } else if (user && isMatch) {
  //     const { _id } = user;
  //     const payload = { _id };
  //     const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
  //       expiresIn: process.env.JWT_EXPIRE,
  //     });
  //     const jsonResponse = {
  //       access_token: jwtToken,
  //       user: {
  //         email: user.email,
  //         id: _id,
  //       },
  //     };
  //     res.status(200).json(jsonResponse);
  //   } else {
  //     res.json({ error: 'Login Error' });
  //   }
  // });

  if (!user) {
    return next(new ErrorResponse('Invalid credentials'), 401);
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    console.log(isMatch);
    return next(new ErrorResponse('Invalid credentials'), 401);
  }

  sendTokenResponse(user, 200, res);
});

// Get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

// @route Get /api/v1/auth/me
exports.getMe = asyncHandler(async (req, res, next) => {
  // req.user.id from protect middleware
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @route POST /api/v1/auth/forgotpassword
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new ErrorResponse('There is no user with that email'), 404);
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  // Save to DB
  await user.save({
    validateBeforeSave: false,
  });

  // Create reset url
  // https://localhost/api/v1/resetpasspassword/passwordtoken
  const resetUrl = `${req.protocal}://${req.get(
    'host'
  )}/api/v1/resetpassword/${resetToken}`;

  const message = `You are receiving this email because 
  you has requested the reset of a password. 
  Please click the link to reset password${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(202).json({
      success: true,
      data: 'Email sent',
    });
  } catch (error) {
    user.getResetPasswordToken = undefined;
    user.getResetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(error.message), 500);
  }

  // res.status(200).json({
  //   success: true,
  //   data: {
  //     email: req.body.email,
  //     resetToken: resetToken,
  //   },
  // });
});
