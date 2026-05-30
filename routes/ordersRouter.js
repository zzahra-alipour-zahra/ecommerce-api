const express = require('express');
const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');

const router = express.Router();

// (callback of zarrinpal) without protect and verify should be GET methode
router.get('/payment/verify', orderController.verifyPayment);

// all routes are protected from now
router.use(authController.protect);

// users can see their own orders
// router.get('/myOrders', orderController.getMyOrders);

// summery of all aorders is should be for only admin 
router.get(
  '/summary',
  authController.restrictTo('admin'),
  orderController.getOrderSummary
);


router
  .route('/')
  .get(
    orderController.getAllOrders // i handle it in controllers for admin an users
  )
  .post(orderController.createOrder);


router
  .route('/:id')
  .get(orderController.getOrder)  // i handle it in controllers for admin an users
  .patch(
    authController.restrictTo('admin'),
    orderController.updateOrder
  )
  .delete(
    authController.restrictTo('admin'),
    orderController.deleteOrder
  );

module.exports = router;












