const express = require('express');
const router = express.Router();
const isLoggedIn = require('../utils/isLoggedIn');
const {City, citySchema} = require('../models/city');

router.get("/", (req, res) => {
  res.render("landing");
})

router.post("/account/watchlist", isLoggedIn, async (req, res) => {
  // res.render("account");
  const city = await City.findById(req.body.cityId).exec();
  req.user.watchlist.push(city);
  req.user.save();
  req.flash("success", "Added to watchlist!");
  res.redirect(`/cities/${req.body.cityId}`);
})

router.get("/account/watchlist", isLoggedIn, async (req, res) => {
  res.render("cities", {cities: req.user.watchlist});
})

router.delete("/account/watchlist", isLoggedIn, async (req, res) => {
  req.user.watchlist.splice(req.user.watchlist.findIndex(i => i._id.equals(req.body.cityId)), 1);
  req.user.save();
  req.flash("success", "Deleted from watchlist!");
  res.redirect(`/cities/${req.body.cityId}`);
})

router.get("/account", isLoggedIn,(req, res) => {
  res.render("account");
})


module.exports = router;
