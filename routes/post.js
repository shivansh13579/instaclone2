const mongoose = require('mongoose');


const postModel = mongoose.Schema({
  picture: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  caption: String,
  date: {
    type: Date,
    default: Date.now()
  },
  likes: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
  ],

  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post"
  }]
});


module.exports = mongoose.model("post",postModel);
