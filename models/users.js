const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  token: String,
  salt: String
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
