const express = require("express");
const app = express();
const bodyParser = require("body-parser");


//Confuguration
app.use( bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

let campgrounds = [
    {name:"Charlie Cruz", image:"https://ubiqum.com/assets/uploads/2019/03/untitled-design-1-1-1.png"},
    {name:"Charlie Cruz", image:"https://ubiqum.com/assets/uploads/2019/03/untitled-design-1-1-1.png"},
    {name:"Charlie Cruz", image:"https://ubiqum.com/assets/uploads/2019/03/coding_bootcamp.jpg"}
  ];

//Routes
app.get("/", (req, res) =>{
  res.render("landing")
})

app.get("/campgrounds", function(req, res){
  res.render("campgrounds", {campgrounds: campgrounds});
})

app.get("/campgrounds/new",(req, res) =>{
  res.render("new.ejs")
});

app.post("/campgrounds",(req, res)=>{
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = {name: name, image: image};
  campgrounds.push(newCampground);
  res.redirect("/campgrounds");
});


//Start Server
app.listen(3000, () =>{
  console.log("Project has started!")
})
