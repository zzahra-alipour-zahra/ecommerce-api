const express = require('express');
const colorsController = require('./../controllers/colorsController'); 
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(colorsController.getAllColors)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    colorsController.setUserId,
    colorsController.createColor
  );

router
  .route('/:id')
  .get(colorsController.getColor)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    colorsController.updateColor
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    colorsController.deleteColor
  );

module.exports = router;