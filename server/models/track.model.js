const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trackSchema = new Schema({
  title: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  artist: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  album: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  releaseDate: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  personel: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  catalogNumber: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
    
}, {
  timestamps: true,
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;