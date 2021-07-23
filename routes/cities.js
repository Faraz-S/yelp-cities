const express = require('express');
const router = express.Router();
const City = require('../models/city');
const Comment = require('../models/comment');
const isLoggedIn = require('../utils/isLoggedIn');
const checkCityOwner = require('../utils/checkCityOwner')

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
    name: req.body.name,
    country, // country on its own is the same as country: country
    description: req.body.description,
    image: req.body.image,
    population: req.body.population,
    region,
    owner: {
      id: req.user._id,
      username: req.user.username
    }
  }

  try {
      const city = await City.create(newCity)
      console.log(city)
      res.redirect("/cities/" + city._id)
  } catch (err){
    console.log(err);
    res.send("create route broken .. /cities POST")
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
    res.render("cities", {cities});
  } else {
      // If no, send an error
      res.send("Please enter a valid region")
  }


});

// Show Route
router.get("/:id", async (req, res) => {
  try {
    console.log("id: ", req.params.id);
    const city = await City.findById(req.params.id).exec();
    const comments = await Comment.find({cityId: req.params.id});
    res.render("cities_show", {city, comments});
  } catch (err) {
    console.log(err);
    res.send("Show route broken .. /cities/id");
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
    res.redirect(`/cities/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.send("Update route broken .. /cities/id PUT")
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
    console.log("Deleted: ", deletedCity);
    res.redirect("/cities")

  } catch (err) {
    console.log(err);
    res.send("Delete route broken .. /cities/id DELETE");
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
