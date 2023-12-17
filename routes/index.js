var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require('./users')
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res) {
  res.render('index', {footer: false});
});

router.get('/login', function(req, res) {
  res.render('login', {footer: false});
});

router.get('/feed', function(req, res) {
  res.render('feed', {footer: true});
});

router.get('/profile', function(req, res) {
  res.render('profile', {footer: true});
});

router.get('/search', function(req, res) {
  res.render('search', {footer: true});
});

router.get('/edit', function(req, res) {
  res.render('edit', {footer: true});
});

router.get('/upload', function(req, res) {
  res.render('upload', {footer: true});
});

router.push('/register',function(req,res){
  const data = new userModel({
    username:req.body.username,
    name:req.body.name,
    email:req.body.email,
  });

  userModel.register(data,req.body.passport)
  .then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })
  })
});

router.push("/login",passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/"
}),function(req,res,next){

});

router.get("/logout",function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
});

module.exports = router;
