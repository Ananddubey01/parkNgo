const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A host location must have a name!'],
    unique: true,
    trim: true,
  },
  summary: {
    type: String,
    maxlength: 100,
    required: [true, 'Kindly give a Summary about your host Parking Location'],
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 1.0,
  },

  price: {
    type: Number,
    required: [true, 'A location must have price!'],
  },
  neighborhood_overview: {
    type: String,
    maxlength: 100,
  },
  car_type: {
    type: Array,
    default: [],
  },
  dimensions: {
    dimensions_length: Number,
    dimensions_width: Number,
  },
  amenities: {
    type: Array,
    default: [],
  },
  availability: {
    type: Number,
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  hostPosition: {
    type: { String, default: 'Point', enum: ['Point'] },
    coordinates: [Number],
    address: String,
  },

  // Futher Schema Entries to be embedded
});
const hostLocation = mongoose.model('hostLocation', locationSchema);

module.exports = hostLocation;
