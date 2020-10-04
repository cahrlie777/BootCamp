let Campground = require("../models/campground");
let Comment = require("../models/comment");

let middlewareObject = {};

//midleware
middlewareObject.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

middlewareObject.checkOwnership = (req, res, next) => {
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, (err,foundCampground)=>{
      if(err){
        res.redirect("back");
      }else{
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }else{
          res.redirect("back");
        }
      }
    });
  } else {
      res.redirect("back");
  }
};


middlewareObject.checkCommentOwnership = (req, res, next) => {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, (err,foundComment)=>{
      if(err){
        res.redirect("back");
      }else{
        //user owns the comment
        if(foundComment.author.id.equals(req.user._id)){
          next();
        }else{
          res.redirect("back");
        }
      }
    });
  } else {
      res.redirect("back");
  }
}

module.exports = middlewareObject;
