const express = require('express');
const router = express.Router({mergeParams: true});
const Comment = require('../models/comment');
const {City, citySchema} = require('../models/city');
const isLoggedIn = require('../utils/isLoggedIn');
const checkCommentOwner = require('../utils/checkCommentOwner');

// New Comment - Show Form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("comments_new", {cityId: req.params.id})
})

// Create Comment - Actually Update DB
router.post("/", isLoggedIn, async (req, res) => {
  try {
    // Create the comment
    const comment = await Comment.create({
      user: {
        id: req.user._id,
        username: req.user.username
      },
      text: req.body.text,
      cityId: req.body.cityId,
    }) // Can create faster using the spread operator
    console.log(comment);
    // redirect to the show page for the city
    req.flash("success", "Comment added!");
    res.redirect(`/cities/${req.body.cityId}`)
  } catch (err) {
    console.log(err);
    req.flash("error", "Error creating comment");
    res.redirect("/cities");
  }
})

// Edit Comment - Show the edit Form
router.get("/:commentId/edit", checkCommentOwner, async (req, res) => {
  try {
    const city = await City.findById(req.params.id).exec();
    const comment = await Comment.findById(req.params.commentId).exec();
    console.log("city:", city);
    console.log("comment:", comment);
    res.render("comments_edit", {city, comment});
  } catch(err) {
    console.log(err);
    res.send("Broken ... Comment Edit GET")
  }
})

// Update Comment - Actually update in DB
router.put("/:commentId", checkCommentOwner, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true});
    console.log("comment:", comment);
    req.flash("success", "Comment updated!");
    res.redirect(`/cities/${req.params.id}`);
  } catch (err) {
    console.log(err);
    req.flash("error", "Error editing comment");
    res.redirect("/cities");
  }
})

// Delete Comment
router.delete("/:commentId", checkCommentOwner, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId).exec();
    console.log("deleted comment", comment);
    req.flash("success", "Comment deleted!");
    res.redirect(`/cities/${req.params.id}`);
  } catch {
    console.log(err);
    req.flash("error", "Error deleting comment");
    res.redirect("/cities")
  }
})

module.exports = router;
