const mongoose = require('mongoose');
const Product=require('./../../model/Product');
const Order = require('./../../model/Order');
const AppError = require('./../../utils/appError');
const zarinpalService = require('./../payment/zarinpal.service');
const stockService = require('./../inventory/productStock.service'); 


exports.createOrderData = async (user, orderItems, shippingAddress) => {
  
  const productIds = orderItems.map(i => i._id);

  const products = await Product.find({
    _id: { $in: productIds }
  });

  let totalPrice = 0;
  const dbOrderItems = [];

  
  for (const item of orderItems) {
    const product = products.find(
      p => p._id.toString() === item._id
    );

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.totalQty < item.qty) {
      throw new AppError(`${product.name} stock is not enough`, 400);
    }

    dbOrderItems.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      qty: item.qty,
      description: product.description
    });

    totalPrice += product.price * item.qty;
  }

  
  const order = await Order.create({
    user: user._id,
    orderItems: dbOrderItems,
    shippingAddress,
    totalPrice,
    paymentStatus: "pending",
    isPaid: false
  });

  
  const paymentData = await zarinpalService.requestZarinpalPayment(
    totalPrice,
    `Order ${order._id}`,
    user.email,
    user.phone
  );

  
  order.paymentAuthority = paymentData.authority;
  await order.save();

  return {
    paymentUrl: paymentData.url,
    authority: paymentData.authority,
    orderId: order._id
  };
};

exports.verifyOrderPayment = async (authority, status) => {
  if (status !== "OK") {
    throw new AppError("Payment canceled or failed", 400);
  }

  const order = await Order.findOne({ paymentAuthority: authority });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.isPaid) {
    throw new AppError("Order already paid", 400);
  }

  const verifyData = await zarinpalService.verifyZarinpalPayment(
    order.totalPrice,
    authority
  );

  if (!verifyData.success) {
    throw new AppError("Payment verification failed", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
   
    await stockService.bulkUpdateStock(order.orderItems, session);

    order.isPaid = true;
    order.paymentStatus = "paid";
    order.paidAt = Date.now();
    order.refId = verifyData.refId;

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

exports.getSummaryData = async () => {
  const summary = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
        avgOrderValue: { $avg: '$totalPrice' }
      }
    }
  ]);
  return summary.length > 0 ? summary[0] : { totalOrders: 0, totalSales: 0, avgOrderValue: 0 };
};

