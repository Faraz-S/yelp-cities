const express = require('express');
const router = express.Router({mergeParams: true});
const Comment = require('../models/comment');
const {City, citySchema} = require('../models/city');
const isLoggedIn = require('../utils/isLoggedIn');
const checkCommentOwner = require('../utils/checkCommentOwner');
const mongoose = require('mongoose');

// New Comment - Show Form
// router.get("/new", isLoggedIn, (req, res) => {
//   res.render("comments_new", {cityId: req.params.id})
// })

// Create Comment - Actually Update DB
router.post("/", isLoggedIn, async (req, res) => {
  try {
    // Create the comment
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    const year = d.getFullYear();
    const month = months[d.getMonth()];
    const day = d.getDate();
    const date = `${month} ${day}, ${year}`;
    const comment = await Comment.create({
      user: {
        id: req.user._id,
        username: req.user.username
      },
      text: req.body.text,
      cityId: req.body.cityId,
      upvotes: [req.user.username],
      downvotes: [],
      date
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
// router.get("/:commentId/edit", checkCommentOwner, async (req, res) => {
//   try {
//     const city = await City.findById(req.params.id).exec();
//     const comment = await Comment.findById(req.params.commentId).exec();
//     console.log("city:", city);
//     console.log("comment:", comment);
//     res.render("comments_edit", {city, comment});
//   } catch(err) {
//     console.log(err);
//     res.send("Broken ... Comment Edit GET")
//   }
// })

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

// Vote
router.post("/vote", isLoggedIn, async (req, res) => {
  console.log("Request body: ", req.body);

  const cmntId = mongoose.Types.ObjectId(req.body.commentId);
  const comment = await Comment.findById(cmntId);
  const alreadyUpvoted = comment.upvotes.indexOf(req.user.username);
  const alreadyDownvoted = comment.downvotes.indexOf(req.user.username);

  let response = {};
  // Voting logic
  if(alreadyUpvoted == -1 && alreadyDownvoted == -1) { // Has not voted
    if (req.body.voteType === "up") { // Upvoting
      comment.upvotes.push(req.user.username);
      comment.save();
      response = {message: "Upvote tallied", code: 1};
    } else if (req.body.voteType === "down") { // Downvoting
      comment.downvotes.push(req.user.username);
      comment.save();
      response = {message: "Downvote tallied", code: -1};
    } else {
      response = {message: "Error 1", code: "err"};
    }
  } else if (alreadyUpvoted >= 0) { // Already upvoted
    comment.upvotes.splice(alreadyUpvoted, 1);
    if (req.body.voteType === "up") { // Remove upvote
      response = {message: "Upvote removed", code: 0};
    } else if (req.body.voteType === "down") {
      comment.downvotes.push(req.user.username);
      response = {message: "Changed to downvote", code: -1};
    } else {
      response = {message: "Error 2", code: "err"};
    }
    comment.save();
  } else if (alreadyDownvoted >= 0) { // Already downvoted
    comment.downvotes.splice(alreadyDownvoted, 1);
    if (req.body.voteType === "up") {
      comment.upvotes.push(req.user.username);
      response = {message: "Changed to upvote", code: 1};
    } else if (req.body.voteType === "down") { // Remove downvote
      response = {message: "Downvote removed", code: 0};
    } else {
      response = {message: "Error 3", code: "err"};
    }
    comment.save();
  } else { //Error
    response = {message: "Error 4, should not reach here", code: "err"};
  }

  // Update score immediately prior to sending
  response.score = comment.upvotes.length - comment.downvotes.length;

  res.json(response);
})

module.exports = router;
