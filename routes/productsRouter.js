const express = require('express');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reivewRouter');
const { uploadProductImages } = require('./../utils/upload');

const router = express.Router();

// Nested Route for seeing reviews of a certain product
router.use('/:productId/reviews', reviewRouter);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    // uploadProductImages,
    productController.createProduct
  );

router
  .route('/stats')
  .get(
    authController.protect,           
    authController.restrictTo('admin'), 
    productController.getProductStats
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct
  );

module.exports = router;
