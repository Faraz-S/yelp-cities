const Comment = require('../models/comment');

const checkCommentOwner = async (req, res, next) => {
  if(req.isAuthenticated()) { // Check if the user is logged in
    const comment = await Comment.findById(req.params.commentId).exec();
    // If logged in, check if they own the comment
    if(comment.user.id.equals(req.user._id)) { // If owner, render the form to edit
      next();
    }
    else { // If not, redirect back to show Page
      req.flash("error", "You don't have permission to do that!");
      res.redirect("back");
    }
  } else { // If not logged in, redirect to /login
    req.flash("error", "You must be logged in to do that!");
    res.redirect('/login');
  }
}

module.exports = checkCommentOwner;
