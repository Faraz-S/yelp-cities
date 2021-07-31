const {City, citySchema} = require('../models/city');
const Comment = require('../models/comment');



const city_seeds = [
  {
    name: "Toronto",
    country: "Canada",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "https://static.amazon.jobs/locations/145/thumbnails/toronto-thumb2.jpg?1617649187",
    population: 2000000,
    region: "north america"
  },
  {
    name: "London",
    country: "England",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "https://www.history.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTYyNDg1MjE3MTI1Mjc5Mzk4/topic-london-gettyimages-760251843-promo.jpg",
    population: 1000000,
    region: "Europe"
  },
  {
    name: "Los Angeles",
    country: "USA",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "https://cdn.turkishairlines.com/m/59100baee0551af9/original/Travel-Guide-of-Los-Angeles-via-Turkish-Airlines.jpg",
    population: 4000000,
    region: "north america"
  }
]

const seed = async () => {
  // Delete all the current cities and comments
  await City.deleteMany();
  console.log("Deleted all the cities");

  await Comment.deleteMany();
  console.log("Deleted all the comments");

  // // Create three new cities
  // for (const city_seed of city_seeds) {
  //   let city = await City.create(city_seed);
  //   console.log("Created a new city: ", city.name);
  //   // Create a new comment for each city
  //   await Comment.create({
  //     text: "Comment1",
  //     user: "User1",
  //     cityId: city._id
  //   })
  //   console.log("Created a new comment")
  // }


}

module.exports = seed;
