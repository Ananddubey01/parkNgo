const fs = require('fs');
const User = require('./../models/userModel.js');
const factory = require('./handlerFactory.js');


exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not yet defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not yet defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not yet defined',
  });
};
