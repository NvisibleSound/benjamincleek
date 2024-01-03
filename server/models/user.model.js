const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;