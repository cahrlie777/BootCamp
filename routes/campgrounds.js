let express = require("express");
let router  = express.Router();
let Campground = require("../models/campground");

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
router.get("/campgrounds/new",(req, res) =>{
  res.render("campgrounds/new.ejs",{currentUser: req.user})
});

//Create - add new campground to DB
router.post("/campgrounds",(req, res)=>{
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let newCampground = {name: name, image: image, description: description};
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


module.exports = router;
