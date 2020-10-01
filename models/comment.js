const mongoose   = require("mongoose");

//Schema setup
let commentSchema =  new mongoose.Schema({
   text: String,
   author: String,
});

module.exports = mongoose.model("Comment",commentSchema);
