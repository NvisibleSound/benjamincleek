const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  username: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  first: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  last: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  email: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  password: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  dob: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },  
  location: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
}, {
  timestamps: true,
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;