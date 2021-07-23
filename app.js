// =====================
// IMPORTS
// =====================
// NPM Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

// Config Import
let config;
try {
  config = require("./config");
} catch (e) {
  console.log("Could not import config. This probably means you're not working locally")
  console.log(e);
}


//Route Imports
const mainRoute = require('./routes/main');
const cityRoutes = require('./routes/cities');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');

// Model Imports
const City = require("./models/city");
const Comment = require("./models/comment")
const User = require("./models/user")

// =====================
// DEVELOPMENT
// =====================
// Morgan
app.use(morgan('tiny'));

// Seed the DB
// const seed = require('./utils/seed')
// seed();

// =====================
// CONFIG
// =====================

// Body Parser Config
app.use(bodyParser.urlencoded({extended: true}));

// Connect to DB (Mongoose Config)
try {
  mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
} catch (e) {
  console.log("Could not connect using config. This probaly means you're not working locally")
  mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
}


// Express config
app.set("view engine", "ejs");
app.use(express.static('public'));

// Express Session Config
app.use(expressSession({
  secret: process.env.ES_SECRET || config.expressSession.secret,
  resave: false,
  saveUninitialized: false
}));


// Method Override Config
app.use(methodOverride('_method'));

// Connect Flash
app.use(flash());

// Passport Config
app.use(passport.initialize());
app.use(passport.session()); // Allows persistent sessions
passport.serializeUser(User.serializeUser()); // What data should be stored in session
passport.deserializeUser(User.deserializeUser()); // Get the user data from the stored session
passport.use(new LocalStrategy(User.authenticate())); // Use the local strategy

// Current User Middleware Config
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
})

// Route Config
app.use("/", mainRoute);
app.use("/", authRoutes);
app.use("/cities", cityRoutes);
app.use("/cities/:id/comments", commentRoutes);

// =====================
// LISTEN
// =====================
app.listen(process.env.PORT || 3000, () => {
  console.log("yelp_cities is running");
});
