const authService = require('./../services/auth/auth.service');
const tokenService = require('./../services/auth/auth.token.service');
const passwordService = require('./../services/auth/auth.password.service');
const emailService = require('./../services/auth/auth.email.service');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Helper for sending response with token
const createSendToken = (user, statusCode, res) => {
  const token = tokenService.signToken(user._id);
  const cookieOptions = tokenService.getCookieOptions();

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await authService.signupUser(req.body);
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const user = await authService.loginUser(req.body.email, req.body.password);
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("please log in ....", 401));
  }

  const decoded = await tokenService.verifyToken(token);
  const currentUser = await authService.getUserById(decoded.id);
  
  if (!currentUser) {
    return next(new AppError("Not find user with this token", 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("user changes the password recently .... please login again", 401));
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("you dont have permision to access this section", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { user, resetToken } = await passwordService.createResetToken(req.body.email);
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  try {
    await emailService.sendPasswordResetEmail(user.email, resetURL);

    res.status(200).json({
      status: 'success',
      message: "token was send to email",
      resetToken
    });
  } catch (err) {
    await passwordService.clearResetTokenOnFail(user);
    return next(new AppError("something went wrong to sending email", 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await passwordService.resetPassword(
    req.params.token, 
    req.body.password, 
    req.body.passwordConfirm
  );
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await passwordService.updatePassword(
    req.user.id,
    req.body.passwordCurrent,
    req.body.password,
    req.body.passwordConfirm
  );
  createSendToken(user, 200, res);
});

