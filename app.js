const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose");


//Confuguration
app.use( bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost/bootcamp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

//Scheama setup
let campgroundSchema =  new mongoose.Schema({
   name: String,
   image: String
});

let Campground = mongoose.model("Campground",campgroundSchema);


//Routes
app.get("/", (req, res) =>{
  res.render("landing")
})

app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allcampgrounds) =>{
    if(err){

    }else{
    res.render("campgrounds", {campgrounds: allcampgrounds});
    }
  })
});

app.get("/campgrounds/new",(req, res) =>{
  res.render("new.ejs")
});

app.post("/campgrounds",(req, res)=>{
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = {name: name, image: image};
  Campground.create(newCampground,(err,camground)=>{
    if(err){
      console.log(err);
    }else{
      res.redirect("/campgrounds");
    }
  });
});


//Start Server
app.listen(3000, () =>{
  console.log("Project has started!")
})
