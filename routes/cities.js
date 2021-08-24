const express = require('express');
const router = express.Router();
const {City, citySchema} = require('../models/city');
const Comment = require('../models/comment');
const isLoggedIn = require('../utils/isLoggedIn');
const checkCityOwner = require('../utils/checkCityOwner')
const fetch = require('node-fetch');

// Config Import
let config;
try {
  config = require("../config");
} catch (e) {
  console.log("Could not import config. This probably means you're not working locally")
  console.log(e);
}

// Api Key Import
let API_KEY;
try {
  API_KEY = config.weatherAPI.API_KEY;
} catch (e) {
  console.log("Could not connect using config. This probaly means you're not working locally")
  API_KEY = process.env.API_KEY;
}

// Index Route
router.get("/", async (req, res) => {
  console.log(req.user);
  try {
    const cities = await City.find().exec()
    res.render("cities", {cities}); // in ES6, doing {cities: cities} is the same as just {cities}
  } catch (err) {
    console.log(err);
    res.send("you broke it... /index");
  }
})

// Create Route
router.post("/", isLoggedIn, async (req, res) => {
  const region = req.body.region.toLowerCase();
  const country = req.body.country.toLowerCase();
  const newCity = {
    name: req.body.name.toLowerCase(),
    country, // country on its own is the same as country: country
    description: req.body.description,
    image: req.body.image,
    population: req.body.population,
    region,
    owner: {
      id: req.user._id,
      username: req.user.username
    }
    // upvotes: [req.user.username],
    // downvotes: []
  }

  try {
      const city = await City.create(newCity)
      console.log(city)
      req.flash("success", "City created!");
      res.redirect("/cities/" + city._id);
  } catch (err){
    req.flash("error", "Error creating city")
    res.redirect("/cities");
  }
  // City.create(newCity)
  // .then((city) => {
  //   console.log(city)
  //   res.redirect("/cities/" + city._id)
  // })
  // .catch((err) => {
  //   console.log(err)
  //   res.send(err)
  // })

})

// New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("cities_new")
})

// search
router.get("/search", async (req, res) => {
  try {
    const cities = await City.find({
      $text: {
        $search: req.query.term
      }
    });
    res.render("cities", {cities})
  } catch (err) {
    console.log(err);
    res.send("broken search");
  }
})

// region
router.get("/region/:region", async (req, res) => {
  // Check if the given region is valid
  const validRegions = ["africa", "asia", "australia", "europe", "north america", "south america"];
  if(validRegions.includes(req.params.region.toLowerCase())){
    // If yes, continue
    const cities = await City.find({region: req.params.region}).exec();
    console.log(cities);
    res.render("cities", {cities});
  } else {
      // If no, send an error
      res.send("Please enter a valid region")
  }


});

// Vote
router.post("/vote", isLoggedIn, async (req, res) => {
  console.log("Request body: ", req.body);
  // {
  //   cityId: "abc123",
  //   voteType: "up" or "down"
  // }

  const city = await City.findById(req.body.cityId);
  const alreadyUpvoted = city.upvotes.indexOf(req.user.username);
  const alreadyDownvoted = city.downvotes.indexOf(req.user.username);

  let response = {};
  // Voting logic
  if(alreadyUpvoted == -1 && alreadyDownvoted == -1) { // Has not voted
    if (req.body.voteType === "up") { // Upvoting
      city.upvotes.push(req.user.username);
      city.save();
      response = {message: "Upvote tallied", code: 1};
    } else if (req.body.voteType === "down") { // Downvoting
      city.downvotes.push(req.user.username);
      city.save();
      response = {message: "Downvote tallied", code: -1};
    } else {
      response = {message: "Error 1", code: "err"};
    }
  } else if (alreadyUpvoted >= 0) { // Already upvoted
    city.upvotes.splice(alreadyUpvoted, 1);
    if (req.body.voteType === "up") { // Remove upvote
      response = {message: "Upvote removed", code: 0};
    } else if (req.body.voteType === "down") {
      city.downvotes.push(req.user.username);
      response = {message: "Changed to downvote", code: -1};
    } else {
      response = {message: "Error 2", code: "err"};
    }
    city.save();
  } else if (alreadyDownvoted >= 0) { // Already downvoted
    city.downvotes.splice(alreadyDownvoted, 1);
    if (req.body.voteType === "up") {
      city.upvotes.push(req.user.username);
      response = {message: "Changed to upvote", code: 1};
    } else if (req.body.voteType === "down") { // Remove downvote
      response = {message: "Downvote removed", code: 0};
    } else {
      response = {message: "Error 3", code: "err"};
    }
    city.save();
  } else { //Error
    response = {message: "Error 4, should not reach here", code: "err"};
  }

  // Update score immediately prior to sending
  response.score = city.upvotes.length - city.downvotes.length;

  res.json(response);
})

// Show Route
router.get("/:id", async (req, res) => {
  try {
    console.log("id: ", req.params.id);
    const city = await City.findById(req.params.id).exec();
    const comments = await Comment.find({cityId: req.params.id});
    fetch(`http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city.name}`)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        res.render("cities_show", {city, comments, data, cityId: req.params.id});
        console.log(data)
      })
      .catch((err) => {
        res.send(err);
      })
  } catch (err) {
    console.log(err);
    res.send(err);
  }
})

// Edit Route
router.get("/:id/edit", checkCityOwner, async (req, res) => {
  const city = await City.findById(req.params.id).exec();
  res.render("cities_edit", {city});
})
//   // Get the city from the DB
//   City.findById(req.params.id)
//   .exec()
//   .then((city) => {
//     // Render the edit form, passing in that city
//     res.render("cities_edit", {city})
//   })


// Update Route
router.put("/:id", checkCityOwner, async (req, res) => {
  const region = req.body.region.toLowerCase();
  const country = req.body.country.toLowerCase();
  const city = {
    name: req.body.name,
    country, // country on its own is the same as country: country
    description: req.body.description,
    image: req.body.image,
    population: req.body.population,
    region
  }

  try {
    const updatedCity = await City.findByIdAndUpdate(req.params.id, city, {new: true}).exec()
    console.log(updatedCity);
    req.flash("success", "City updated!");
    res.redirect(`/cities/${req.params.id}`);
  } catch (err) {
    console.log(err);
    req.flash("error", "Error updating city")
    res.redirect("/cities");
  }

  // City.findByIdAndUpdate(req.params.id, city, {new: true})
  // .exec()
  // .then((updatedCity) => {
  //   console.log(updatedCity);
  //   res.redirect(`/cities/${req.params.id}`);
  // })
  // .catch((err) => {
  //   res.send(err);
  // })
})

// Delete Route
router.delete("/:id", checkCityOwner, async (req, res) => {
  try {
    const deletedCity = await City.findByIdAndDelete(req.params.id).exec()
    // console.log("Deleted: ", deletedCity);
    req.flash("success", "City deleted!");
    res.redirect("/cities")

  } catch (err) {
    console.log(err);
    req.flash("error", "Error deleting city");
    res.redirect("back");
  }

  // City.findByIdAndDelete(req.params.id)
  // .exec()
  // .then((deletedCity) => {
  //   console.log("Deleted: ", deletedCity);
  //   res.redirect("/cities")
  // })
  // .catch((err) => {
  //   res.send(err);
  // })
})

module.exports = router;
