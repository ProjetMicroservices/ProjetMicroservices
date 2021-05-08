const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  modele: String,
  marque: String,
  image: String,
  userId: String,
});

module.exports = mongoose.model('Archive', schema);
