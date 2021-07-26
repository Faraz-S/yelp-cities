// ===============
// SELECT ELEMENTS
// ===============
const upvoteBtn = document.getElementById("upvote_btn");
const downvoteBtn = document.getElementById("downvote_btn");

// ===============
// ADD EVENT LISTENERS
// ===============
upvoteBtn.addEventListener("click", async function() {
  // Build fetch options
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({vote: "up"})
  }
  // Send fetch request
  await fetch("/cities/vote", options)
  .then(data => {
    return data.json()
  })
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })
});
