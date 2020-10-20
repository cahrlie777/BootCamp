const express = require("express");
const router  = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const midleware = require("../middleware");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});
const {cloudinary} =require('../cloudinary');


//Index - show all campgrounds
router.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allcampgrounds) =>{
      res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user});
  })
});

//NEW - show form to create new campground
router.get("/campgrounds/new", midleware.isLoggedIn, (req, res) =>{
  res.render("campgrounds/new.ejs",{currentUser: req.user})
});


//Create - add new campground to DB
router.post("/campgrounds", [ midleware.isLoggedIn, upload.array('image')], async (req, res)=>{
  // get data from form and add to campgrounds array
      
   let name = req.body.name;
   let image = req.files.map(f => ({url: f.path, filename: f.filename}));
   let desc = req.body.description;
   let location = req.body.location;
   let author = {
      id: req.user._id,
      username: req.user.username
  }
  const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
  //// Create a new campground and save to DB
  let newCampground = {
    name: name, 
    image: image, 
    description: desc,
    geometry: geoData.body.features[0].geometry,
    location: location,
    author: author};

  Campground.create(newCampground, (err, newlyCreated)=>{
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});



//Shows more info about the image
router.get("/campgrounds/:id", (req, res)=>{
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
    if(err || !foundCampground){
      req.flash("error","Campground not found");
      res.redirect("/campgrounds")
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
router.put("/campgrounds/:id",[midleware.checkOwnership, upload.array('image')], async (req, res)=>{
  console.log(req.body);
  const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
  let image = req.files.map(f => ({url: f.path, filename: f.filename}));
  let updateCamp = req.body.campground;
  updateCamp = {...updateCamp,  geometry: geoData.body.features[0].geometry};

  const campground = await Campground.findByIdAndUpdate(req.params.id, {...updateCamp});
  campground.image.push(...image);
  await campground.save();

 if (req.body.deleteImages) {

        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }

        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    };

  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`)
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
