const express = require('express');
const brandsController = require('./../controllers/brandsController'); 
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(brandsController.getAllBrands)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    brandsController.setUserId,
    brandsController.createBrand
  );

router
  .route('/:id')
  .get(brandsController.getBrand)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    brandsController.updateBrand
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    brandsController.deleteBrand
  );

module.exports = router;






