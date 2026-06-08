const express = require('express');
const categoryController = require('./../controllers/categoryController'); 
const authController = require('./../controllers/authController');
const productRouter = require('./productsRouter');

const router = express.Router();

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.setUserId,
    categoryController.createCategory
  );

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.deleteCategory
  );

  router.use('/:categoryId/products', productRouter);

module.exports = router;

