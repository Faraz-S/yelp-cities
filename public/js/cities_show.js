// ====================
// SELECT ELEMENTS
// ====================
const upvoteBtn = document.getElementById("upvote_btn");
const downvoteBtn = document.getElementById("downvote_btn");
const score = document.getElementById("score");
const watchlistBtn = document.getElementById("watchlist_btn");

// ====================
// HELPER FUNCTIONS
// ====================
const sendVote = async (voteType) => {
  // Build fetch options
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (voteType === "up") {
    options.body = JSON.stringify({
      voteType: "up",
      cityId
    });
  } else if (voteType === "down"){
    options.body = JSON.stringify({
      voteType: "down",
      cityId
    });
  } else {
    throw "voteType must be up or down"
  }

  // Send fetch request
  await fetch("/cities/vote", options)
  .then(data => {
    return data.json()
  })
  .then(res => {
    console.log(res);
    handleVote(res.score, res.code)
  })
  .catch(err => {
    console.log(err);
  })
}

const handleVote = (newScore, code) => {
  // Update the score
  score.innerText = newScore;

  // Update cote button colours
  if (code === 0) {
    upvoteBtn.classList.remove("btn-success");
    upvoteBtn.classList.add("btn-outline-success");
    downvoteBtn.classList.remove("btn-danger");
    downvoteBtn.classList.add("btn-outline-danger");
  } else if (code === 1) {
    upvoteBtn.classList.add("btn-success");
    upvoteBtn.classList.remove("btn-outline-success");
    downvoteBtn.classList.remove("btn-danger");
    downvoteBtn.classList.add("btn-outline-danger");
  } else if (code === -1) {
    upvoteBtn.classList.remove("btn-success");
    upvoteBtn.classList.add("btn-outline-success");
    downvoteBtn.classList.add("btn-danger");
    downvoteBtn.classList.remove("btn-outline-danger");
  } else { // Error
    console.log("error in handleVote");
  }
}

// ====================
// ADD EVENT LISTENERS
// ====================
upvoteBtn.addEventListener("click", async function() {
  sendVote("up");
});
downvoteBtn.addEventListener("click", async function() {
  sendVote("down");
});
