const Order = require('../model/Order');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handleFactory');
const APIFeatures = require('./../utils/apiFeatures');
const orderService = require('./../services/order/order.service');


exports.createOrder = catchAsync(async (req, res, next) => {
  const { orderItems, shippingAddress } = req.body;
  const user = req.user;

  const result = await orderService.createOrderData(user, orderItems, shippingAddress);

  res.status(201).json({
    status: 'success',
    message: 'Transferring to payment gateway',
    data: result
  });
});


exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { Authority, Status } = req.query; 
  
  const order = await orderService.verifyOrderPayment(Authority, Status);

  res.status(200).json({
    status: 'success',
    message: 'Payment was successful',
    data: { order }
  });
});


exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new AppError('No order found with this ID', 404));
  }

  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to access this order', 403));
  }

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});


exports.getAllOrders = catchAsync(async (req, res, next) => {
  let filter = {};
  
  if (req.user.role !== 'admin') {
    filter = { user: req.user.id };
  }

  const features = new APIFeatures(Order.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query.populate('user', 'name email');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: { orders }
  });
});


exports.getOrderSummary = catchAsync(async (req, res, next) => {
  const summary = await orderService.getSummaryData();

  res.status(200).json({
    status: 'success',
    data: {
      summary
    }
  });
});


exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);















  





