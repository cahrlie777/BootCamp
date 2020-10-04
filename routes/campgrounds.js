let express = require("express");
let router  = express.Router();
let Campground = require("../models/campground");
let Comment = require("../models/comment");
let midleware = require("../middleware");

//Index - show all campgrounds
router.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allcampgrounds) =>{
    if(err){

    }else{
      res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user});
    }
  })
});

//NEW - show form to create new campground
router.get("/campgrounds/new", midleware.isLoggedIn, (req, res) =>{
  res.render("campgrounds/new.ejs",{currentUser: req.user})
});

//Create - add new campground to DB
router.post("/campgrounds",midleware.isLoggedIn,(req, res)=>{
  //get form data
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let author ={
    id: req.user._id,
    username: req.user.username
  };
  let newCampground = {name: name, image: image,  description: description, author: author};
  //create a new campground
  Campground.create(newCampground,(err,newlyCampground)=>{
    if(err){
      console.log(err);
    }else{
      res.redirect("/campgrounds");
    }
  });
});


//Shows more info about the image
router.get("/campgrounds/:id", (req, res)=>{
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
    if(err){
      console.log(err);
    }else{
      res.render("campgrounds/shows", {campground: foundCampground,currentUser: req.user});
    }
  });
});

//EDIT campground route
router.get("/campgrounds/:id/edit",midleware.checkOwnership,(req, res)=>{
    Campground.findById(req.params.id, (err,foundCampground)=>{
        res.render("campgrounds/edit",{campground:foundCampground,currentUser: req.user});
    });
});

//Update campground route
router.put("/campgrounds/:id",midleware.checkOwnership,(req, res)=>{
  Campground.findByIdAndUpdate(req.params.id, req.body.campground,(err,updatedCampground)=>{
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


//Delete campground route
router.delete("/campgrounds/:id",midleware.checkOwnership,(req,res)=>{
  Campground.findByIdAndRemove(req.params.id,(err, campgroundRemoved)=>{
    if(err){
      res.redirect("/campgrounds");
    }else{
      Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    }
  });
});


module.exports = router;
