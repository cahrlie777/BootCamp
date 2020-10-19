require('dotenv').config();
const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      SeedDB     = require("./seeds"),
      flash      = require("connect-flash"),
      passport   = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      User       = require("./models/users");

const campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes    = require("./routes/comments"),
      indexRoutes      = require("./routes/index");

//Configuration
app.use( bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.set("view engine", "ejs");
//SeedDB();


//passport configuration
app.use(require("express-session")({
  secret: "Hey Hey",
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next)=>{
  res.locals.currentUser = req.currentUser;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let databaseurl = process.env.DATABASEURL || 'mongodb://localhost/bootcamp4'
mongoose.connect( databaseurl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
}).then(()=>{
  console.log("Connected to DB!");
}).catch(err =>{
  console.log("ERROR:", err.message);
});

//Routes
app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

//Start Server
app.listen(process.env.PORT || 3000, process.env.IP, () =>{
  console.log("Project has started!")
});

