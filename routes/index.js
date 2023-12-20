var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./post.js');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));
const upload = require("./multer.js");

router.get('/register', function(req, res) {
  res.render('index', {footer: false});
});

router.get('/', function(req, res) {
  res.render('login', {footer: false});
});

router.get('/feed',isLoggedIn,async function(req, res) {
  const posts =await postModel.find().populate("user");
  res.render('feed', {footer: true, posts});
});

router.get('/profile',isLoggedIn,async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user}).populate("posts");
  res.render('profile', {footer: true, user});
});

router.get('/search',isLoggedIn, function(req, res) {
  res.render('search', {footer: true});
});

router.get('/edit',isLoggedIn,async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user})
  res.render('edit', {footer: true, user});
});

router.get('/upload',isLoggedIn ,function(req, res) {
  res.render('upload', {footer: true});
});

router.get('/username/:username',isLoggedIn,async function(req, res) {
  const regex = await new RegExp(`^${req.params.username}`, 'i');
  await userModel.findOne({username: regex}) 
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

router.post("/update",upload.single("image"),async function(req,res,next){
    const user = await userModel.findOneAndUpdate({username: req.session.passport.user},
      {username: req.body.username,
       name: req.body.name,
       bio: req.body.bio
      },
      {new: true}
      );
      if(req.file){
        user.profileImage = req.file.filename;
      } 
      await user.save();
      res.redirect("/profile");
})

router.post("/upload",isLoggedIn,upload.single("image"),async function(req,res){
    const user = await userModel.findOne({username: req.session.passport.user})
    const post = await postModel.create({
      picture: req.file.filename,
      user: user._id,
      caption:req.body.caption,
    })

    user.posts.push(post._id);
    await user.save();
    res.redirect("/feed");
});

module.exports = router;
