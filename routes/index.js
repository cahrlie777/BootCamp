let express = require("express");
let router  = express.Router();
let passport   = require("passport");
let User       = require("../models/users");

router.get("/", (req, res) =>{
  res.render("landing",{currentUser: req.user});
});

//Authentication routes
router.get("/register",(req, res)=>{
  res.render("register",{currentUser: req.user});
});

//handling registretion
router.post("/register",(req, res)=>{
  let newUser = new User({username: req.body.username})
  User.register(newUser,req.body.password,(err, user)=>{
    if(err){
      console.log(err);
      res.render("register");
    }
    passport.authenticate("local")(req, res, ()=>{
      res.redirect("/campgrounds");
    });
  });
});

//show login form
router.get("/login", (req,res)=>{
  res.render("login",{currentUser: req.user});
});


router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login'  }),
  (req, res)=>{
        res.redirect('/campgrounds');
  });

//logic route
router.get("/logout", (req, res)=>{
  req.logout();
  res.redirect("/");
});


module.exports = router;
