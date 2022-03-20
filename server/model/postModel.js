const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  short_desc: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});

module.exports = mongoose.model("postData", postSchema);
