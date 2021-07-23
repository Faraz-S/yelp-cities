const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    },
    text: String,
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City"
    }

});

module.exports = mongoose.model("comment", commentSchema);
