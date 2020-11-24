const fs = require('fs');
const hostLocation = require('./../models/locationModel.js');
const factory = require('./handlerFactory.js');

exports.getAllLocations = factory.getAll(hostLocation);
exports.getLocation = factory.getOne(hostLocation);
exports.createLocation = factory.createOne(hostLocation);
exports.updateLocation = factory.updateOne(hostLocation);
exports.deleteLocation = factory.deleteOne(hostLocation);


