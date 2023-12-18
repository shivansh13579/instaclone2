const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/instagram");

const userModel = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  profileImage: String,
})

userModel.plugin(plm);

module.exports = mongoose.model("user",userModel);
