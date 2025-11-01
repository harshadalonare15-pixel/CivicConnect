const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  fullName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  preferredLanguage: {
    type: String,
    default: 'English',
  },
});

module.exports = mongoose.model('User', UserSchema);
