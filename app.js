
const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      Campground = require("./models/campground"),
      SeedDB     = require("./seeds"),
      Comment    = require("./models/comment")

//Confuguration
app.use( bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
SeedDB();

mongoose.connect('mongodb://localhost/bootcamp3', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

//Campground.create({
  //name: "Granite Hill",
  //image: "https://i.guim.co.uk/img/media/fe1e34da640c5c56ed16f76ce6f994fa9343d09d/0_174_3408_2046/master/3408.jpg?width=620&quality=85&auto=format&fit=max&s=56d5de4c5609ca98def0c3382bd569b4",
  //description: "This is a white Pug."
//}, (err,newlyCampground) => {
    //if(err){
      //console.log(err);
    //}else{
      //console.log(newlyCampground);
    //}
//});

//Routes
app.get("/", (req, res) =>{
  res.render("landing")
})

app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allcampgrounds) =>{
    if(err){

    }else{
    res.render("campgrounds/index", {campgrounds: allcampgrounds});
    }
  })
});

app.get("/campgrounds/new",(req, res) =>{
  res.render("campgrounds/new.ejs")
});

app.post("/campgrounds",(req, res)=>{
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
app.get("/campgrounds/:id", (req, res)=>{
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
    if(err){
      console.log(err);
    }else{
      console.log(foundCampground);
      res.render("campgrounds/shows", {campground: foundCampground});
    }
  });
});


app.get("/campgrounds/:id/comments/new",(req, res)=>{
  Campground.findById(req.params.id, (err, campground) =>{
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {campground: campground});
      }
  })
});

app.post("/campgrounds/:id/comments", (req, res) => {
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





//Start Server
app.listen(3000, () =>{
  console.log("Project has started!")
})
