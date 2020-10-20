let mongoose = require("mongoose");

let campgroundSchema = new mongoose.Schema({
   name: String,
  image: [
    {
      url: String,
      filename: String
    }
  ],
   description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
   location: String,
   createdAt: { type: Date, default: Date.now },
   author:{
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Campground", campgroundSchema)
