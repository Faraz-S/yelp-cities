const express = require('express');
const router = express.Router();
const City = require('../models/city');
const Comment = require('../models/comment');
const User = require('../models/user');
const passport = require('passport');

// Sign Up - New
router.get('/signup', (req, res) => {
  res.render('signup');
})

// Sign Up - Create
router.post('/signup', async (req, res) => {
  try {
    const newUser = await User.register(new User({
      username: req.body.username,
      email: req.body.email
    }), req.body.password);
    // console.log(newUser);
    req.flash("success", `Signed up as ${newUser.username}`);

    passport.authenticate('local')(req, res, () => {
      res.redirect('/cities');
    });
  } catch(err) {
    console.log(err);
    res.send(err);
  }
})

// Login - Show Form
router.get('/login', (req, res) => {
  res.render('login');
})

// Login
router.post("/login", passport.authenticate('local', {
  successRedirect: '/cities',
  failureRedirect: '/login',
  successFlash: "Logged in successfully",
  failureFlash: true
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect('/cities');
})

module.exports = router;
