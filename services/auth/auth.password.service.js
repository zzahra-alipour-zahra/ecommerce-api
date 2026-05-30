const crypto = require('crypto');
const User = require('./../../model/User');
const AppError = require('./../../utils/appError');

exports.createResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("user not find with this email", 404);

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  return { user, resetToken };
};

exports.clearResetTokenOnFail = async (user) => {
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });
};

exports.resetPassword = async (token, password, passwordConfirm) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) throw new AppError("token is not valid or expired", 400);

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return user;
};

exports.updatePassword = async (userId, currentPassword, newPassword, passwordConfirm) => {
  const user = await User.findById(userId).select('+password');

  if (!(await user.correctPassword(currentPassword, user.password))) {
    throw new AppError("current password is wrong", 401);
  }

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  return user;
};
