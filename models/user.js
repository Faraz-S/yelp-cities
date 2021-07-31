const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const {City, citySchema} = require('../models/city');

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  watchlist: [citySchema]
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);
