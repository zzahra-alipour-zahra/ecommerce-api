const User = require('./../model/User');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handleFactory');

// helper function
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};



// Current user controllers :Me

// replacement user.id with params.id for using getOne
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("this route is not for changing password ...please use /updateMyPassword route", 400));
  }

  // prevent to change important field like role by users
  const filteredBody = filterObj(req.body, 'name', 'email', 'phone');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});


exports.updateShippingAddress = catchAsync(async (req, res, next) => {
  const { firstName, lastName, address, city, postalCode, province, country, phone } = req.body;
  
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id, 
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        country,
        phone,
      },
      hasShippingAddress: true,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    message: "address was seccessfully update",
    data: { user: updatedUser }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // Soft Delete: user will not delete really fom database just active flag become false
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Admin only controllers 


exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User); // dont use for updating password
exports.deleteUser = factory.deleteOne(User);


