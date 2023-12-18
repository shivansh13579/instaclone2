var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require('./users')
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));
const upload = require("./multer.js");

router.get('/register', function(req, res) {
  res.render('index', {footer: false});
});

router.get('/', function(req, res) {
  res.render('login', {footer: false});
});

router.get('/feed',isLoggedIn, function(req, res) {
  res.render('feed', {footer: true});
});

router.get('/profile',isLoggedIn, function(req, res) {
  res.render('profile', {footer: true});
});

router.get('/search',isLoggedIn, function(req, res) {
  res.render('search', {footer: true});
});

router.get('/edit',isLoggedIn, function(req, res) {
  res.render('edit', {footer: true});
});

router.get('/upload',isLoggedIn ,function(req, res) {
  res.render('upload', {footer: true});
});

router.post('/register',function(req,res){
  const data = new userModel({
    username:req.body.username,
    name:req.body.name,
    email:req.body.email,
  });

  userModel.register(data,req.body.password)
  .then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })
  })
});

router.post("/",passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/"
}),function(req,res,next){

});

router.get("/logout",function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
});
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

router.post("/upload",upload.single("image"),async function(req,res,next){
    const user = await userModel.findOneAndUpdate({username: req.session.passport.user},
      {username: req.body.username,
       name: req.body.name,
       bio: req.body.bio
      },
      {new: true}
      );
      user.profileImage = req.file.filename;
      await user.save();
      res.redirect("/profile");
})

module.exports = router;
