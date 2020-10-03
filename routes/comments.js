let express = require("express");
let router  = express.Router();
let Campground = require("../models/campground");
let Comment = require("../models/comment");

router.get("/campgrounds/:id/comments/new",isLoggedIn ,(req, res)=>{
  Campground.findById(req.params.id, (err, campground) =>{
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {campground: campground,currentUser: req.user});
      }
  })
});

router.post("/campgrounds/:id/comments", isLoggedIn,(req, res) => {
    Campground.findById(req.params.id, (err, campground) =>{
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }else{
      Comment.create(req.body.comment, (err, comment) =>{
        if(err){
          console.log(err);
        }else{
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});


//midleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
