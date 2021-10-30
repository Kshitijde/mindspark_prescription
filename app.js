const express = require("express");
const path = require("path");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const ejs = require("ejs");
require("./db/mongoose");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

const app = express();
const port = 3000;
//mongodb://127.0.0.1:27017



// Passport Config
require("./config/passport")(passport);

const publicDirectoryPath = path.join(__dirname, "./public");
const viewsPath = path.join(__dirname, "./views/");

// ejs 
app.set("view engine", "ejs");

app.set("views", viewsPath);

app.use(express.static(publicDirectoryPath));

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

global.__basedir = __dirname;
// console.log(__basedir);

// Routes
app.use("/", require("./routers/index.js"));
app.use("/doctor", require("./routers/doctor.js"));
app.use("/patient", require("./routers/patient.js"));

// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  next();
});

app.listen(port, () => {
  console.log("Server listening on port ", port);
});