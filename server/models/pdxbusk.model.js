const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pdxbuskSchema = new Schema({
  //album info
  email: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  artistnews: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  appnews: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  livestream: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  feedback: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  message: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },  
}, {
  timestamps: true,
});

const Pdxbusk = mongoose.model('pdxbusk', pdxbuskSchema);

module.exports = Pdxbusk;