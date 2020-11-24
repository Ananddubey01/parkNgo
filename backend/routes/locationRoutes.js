const express = require('express');
const locationController = require('./../controller/locationController');
const authController = require('./../controller/authController');
const router = express.Router();

router
  .route('/')
  .get(authController.protect, locationController.getAllLocations)
  .post(locationController.createLocation);
router
  .route('/:id')
  .get(locationController.getLocation)
  .patch(locationController.updateLocation)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    locationController.deleteLocation
  );

module.exports = router;
