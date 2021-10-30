const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");

const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");


// Login
router.post("/login", async (req, res, next) => {
  console.log("IN ENDPOINT")
  var user;
  if (req.body.role == "doctor") {
    console.log(req.body.email)
    user = await Doctor.findOne({ email: req.body.email });
    console.log("DOCTOR FOUND", user)
  }
  else if (req.body.role == "patient") {
    user = await Patient.findOne({ email: req.body.email });
    console.log("PATIENT FOUND", user)
  }

  if (user.role === "doctor") {
    console.log("authenticating doc")
    passport.authenticate("local", {
      successRedirect: "/check",
      failureRedirect: "/",
      failureFlash: true,
    })(req, res, next);
  } else {
    console.log("authenticating patient")
    passport.authenticate("local", {
      successRedirect: "/check",
      failureRedirect: "/",
      failureFlash: true,
    })(req, res, next);
  }
});

router.get('/check', passport.authenticate('local'), (req, res) => {
  console.log("IN CHECK")
  console.log(req.user);
})

router.get("/login", forwardAuthenticated, async (req, res) =>
  res.render("login")
);


module.exports = router;