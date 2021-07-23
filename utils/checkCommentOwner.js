const Comment = require('../models/comment');

const checkCommentOwner = async (req, res, next) => {
  if(req.isAuthenticated()) { // Check if the user is logged in
    const comment = await Comment.findById(req.params.commentId).exec();
    // If logged in, check if they own the comment
    if(comment.user.id.equals(req.user._id)) { // If owner, render the form to edit
      next();
    }
    else { // If not, redirect back to show Page
      res.redirect("back");
    }
  } else { // If not logged in, redirect to /login
    res.redirect('/login');
  }
}

module.exports = checkCommentOwner;
