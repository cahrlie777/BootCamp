let express = require("express");
let router  = express.Router();
let Campground = require("../models/campground");
let Comment = require("../models/comment");
let midleware = require("../middleware");

//New
router.get("/campgrounds/:id/comments/new",midleware.isLoggedIn ,(req, res)=>{
  Campground.findById(req.params.id, (err, campground) =>{
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {campground: campground,currentUser: req.user});
      }
  })
});

//Create
router.post("/campgrounds/:id/comments", midleware.isLoggedIn,(req, res) => {
    Campground.findById(req.params.id, (err, campground) =>{
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }else{
      Comment.create(req.body.comment, (err, comment) =>{
        if(err){
          req.flash("error","Something went wrong");
          console.log(err);
        }else{
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success","Successfully added comment");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//Edit route
router.get("/campgrounds/:id/comments/:comment_id/edit", midleware.checkCommentOwnership,(req,res)=>{
  Campground.findById(req.params.id, (err,foundCampground)=>{
    if(err || !foundCampground){
      req.flash("error","No campground found");
      return res.redirect("back")
    }
      Comment.findById(req.params.comment_id,(err,foundComment)=>{
        if(err || !foundComment){
          console.log(err);
        }else{
          res.render("comments/edit",{campground_id: req.params.id,comment:foundComment, currentUser:req.user});
        }
          });
    });
});

//Update route
router.put("/campgrounds/:id/comments/:comment_id",midleware.checkCommentOwnership,(req, res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,(err,updatedComment)=>{
    if(err){
      console.log(err)
      res.redirect("back");
    }else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DELETE route
router.delete("/campgrounds/:id/comments/:comment_id",midleware.checkCommentOwnership,(req,res)=>{
  Comment.findByIdAndRemove(req.params.comment_id,(err, deletedComment)=>{
    if(err){
      console.log(err);
      res.redirect("back");
    }else{
      req.flash("success","Comment deleted")
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


module.exports = router;
