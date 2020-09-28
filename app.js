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
   image: String,
  description: String
});

let Campground = mongoose.model("Campground",campgroundSchema);

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
    res.render("index", {campgrounds: allcampgrounds});
    }
  })
});

app.get("/campgrounds/new",(req, res) =>{
  res.render("new.ejs")
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
  Campground.findById(req.params.id, (err, foundCampground) =>{
    if(err){
      console.log(err);
    }else{
      res.render("shows", {campground: foundCampground});
    }
  });
});

//Start Server
app.listen(3000, () =>{
  console.log("Project has started!")
})
