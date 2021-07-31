const {City, citySchema} = require('../models/city');

const checkCityOwner = async (req, res, next) => {
  if(req.isAuthenticated()) { // Check if the user is logged in
    const city = await City.findById(req.params.id).exec();
    // If logged in, check if they own the city
    if(city.owner.id.equals(req.user._id)) { // If owner, render the form to edit
      next();
    }
    else { // If not, redirect back to show Page
      req.flash("error", "You don't have permission to do that");
      res.redirect("back");
    }
  } else { // If not logged in, redirect to /login
    req.flash("error", "You must be logged in to do that");
    res.redirect('/login');
  }
}

module.exports = checkCityOwner;
