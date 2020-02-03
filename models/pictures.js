const mongoose = require('mongoose');

const pictureSchema = mongoose.Schema({
  pictureName: String,
  pictureUrl: String,
  age: Number,
  gender: String
});

const pictureModel = mongoose.model('pictures', pictureSchema);

module.exports = pictureModel;
