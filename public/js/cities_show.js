// ====================
// SELECT ELEMENTS
// ====================
// const upvoteBtns = document.getElementsByClassName("upvote_btn");
// const downvoteBtns = document.getElementsByClassName("downvote_btn");
// const scores = document.getElementsByClassName("score");
// const watchlistBtn = document.getElementById("watchlist_btn");

const btns = document.getElementsByClassName("voting");

// ====================
// HELPER FUNCTIONS
// ====================
const sendVote = async (voteType, bs) => {
  // Build fetch options
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const commentId = bs[0].classList[0];
  console.log("comment id: ", commentId);

  if (voteType === "up") {
    options.body = JSON.stringify({
      voteType: "up",
      commentId
    });
  } else if (voteType === "down"){
    options.body = JSON.stringify({
      voteType: "down",
      commentId
    });
  } else {
    throw "voteType must be up or down"
  }

  // Send fetch request
  await fetch(`/cities/${cityId}/comments/vote`, options)
  .then(data => {
    console.log("data:", data);
    return data.json()
  })
  .then(res => {
    console.log(res);
    handleVote(res.score, res.code, bs)
  })
  .catch(err => {
    console.log(err);
  })
}

const handleVote = (newScore, code, bs) => {
  // Update the score
  bs[1].innerText = newScore;

  // Update vote button colours
  if (code === 0) {
    bs[0].classList.remove("btn-success");
    bs[0].classList.add("btn-outline-success");
    bs[2].classList.remove("btn-danger");
    bs[2].classList.add("btn-outline-danger");
  } else if (code === 1) {
    bs[0].classList.add("btn-success");
    bs[0].classList.remove("btn-outline-success");
    bs[2].classList.remove("btn-danger");
    bs[2].classList.add("btn-outline-danger");
  } else if (code === -1) {
    bs[0].classList.remove("btn-success");
    bs[0].classList.add("btn-outline-success");
    bs[2].classList.add("btn-danger");
    bs[2].classList.remove("btn-outline-danger");
  } else { // Error
    console.log("error in handleVote");
  }
}

// ====================
// ADD EVENT LISTENERS
// ====================

for(let i = 0; i < btns.length; i++) {
  btns[i].children[0].addEventListener("click", async function() {
    sendVote("up", btns[i].children);
  })

  btns[i].children[2].addEventListener("click", async function() {
    sendVote("down", btns[i].children);
  })
}

// ====================
// MAPS
// ====================
let map;

async function initMap() {
  map = await new google.maps.Map(document.getElementById("map"), {
    center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
    zoom: 12,
  });
}
