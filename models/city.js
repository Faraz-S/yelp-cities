const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: String,
  country: String,
  description: String,
  image: String,
  population: Number,
  region: String,
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

citySchema.index({
  '$**' : 'text'
});
const City = mongoose.model("city", citySchema)

module.exports = City;
