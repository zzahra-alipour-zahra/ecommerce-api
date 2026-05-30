const User = require('./../../model/User');
const AppError = require('./../../utils/appError');

exports.signupUser = async (userData) => {
  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    passwordConfirm: userData.passwordConfirm
  });
  return newUser;
};

exports.loginUser = async (email, password) => {
  if (!email || !password) {
    throw new AppError("please enter email or password", 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError("incorrect email or password", 401);
  }

  return user;
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};
