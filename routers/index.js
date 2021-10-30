const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const Pharmacist = require("../models/pharmacist");

const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

router.get("/", forwardAuthenticated, async (req, res) => {
  res.render('landingPage.ejs')
})
// Login
router.post("/login", forwardAuthenticated, async (req, res, next) => {
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
  else if (req.body.role == "pharmacist") {
    user = await Pharmacist.findOne({ email: req.body.email });
    console.log("PHARMACIST FOUND", user)
  }

  if (user.role === "doctor") {
    console.log("authenticating doc")
    passport.authenticate("local", {
      successRedirect: "/doctor/dashboard",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  } else if (user.role == "patient") {
    console.log("authenticating patient")
    passport.authenticate("local", {
      successRedirect: "/patient/dashboard",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  }
  else if (user.role == "pharmacist") {
    console.log("authenticating pharmacist")
    passport.authenticate("local", {
      successRedirect: "/pharmacist/dashboard",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  }
});

router.get('/check', ensureAuthenticated, (req, res) => {
  console.log("IN CHECK")
  console.log(req.user);
})

router.get("/login", forwardAuthenticated, async (req, res) =>
  res.render("login")
);

router.get("/register", async (req, res) => {
  let doctors = [];
  console.log('in get for register')
  await Doctor.find({}, { name: 1, _id: 0 }).then((users) => {
    doctors = users;
    console.log(doctors)
  })
  // console.log(doctors)
  for (var i = 0; i < doctors.length; i++) {
    console.log("heere", doctors[i]);
  }
  res.render("register", {
    doctors
  })
});

// Register
router.post("/register", async (req, res) => {
  console.log("in route of register")
  let doctors = [];
  console.log('in get for register')
  await Doctor.find({}, { name: 1, _id: 0 }).then((users) => {
    doctors = users;
    console.log(doctors)
  })
  console.log(req.body)
  const { name, email, password, password2, role, expertise, doctor } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({
      msg: "Please enter all fields",
    });
  }

  if (password != password2) {
    errors.push({
      msg: "Passwords do not match",
    });
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
      doctors
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: "Password must be at least 6 characters",
    });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
      doctors
    });
  } else {
    console.log("in else of register...checking role", role)
    if (role == "doctor") {
      Doctor.findOne({ email: email }).then((user) => {
        if (user) {
          errors.push({
            msg: "Email or Registration ID already exists",
          });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
            doctors
          });
        } else {
          const newUser = new Doctor({
            name,
            email,
            password,
            role,
            expertise
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  req.flash("success_msg", "Registration request sent");
                  res.redirect("/doctor/dashboard");
                })
                .catch((err) => console.log(err));
            });
          });
        }
      })
    }
    else if (role == "patient") {
      Patient.findOne({ email: email }).then((user) => {
        if (user) {
          errors.push({
            msg: "Email already exists",
          });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
            doctors
          });
        } else {
          var owner;
          Doctor.findOne({ name: doctor }).then((user) => {
            console.log(user)
            owner = user._id;
            console.log("your master is", owner)
            const newUser = new Patient({
              name,
              email,
              password,
              role,
              owner
            });
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then((user) => {
                    req.flash("success_msg", "Registration request sent");
                    res.redirect("/patient/dashboard");
                  })
                  .catch((err) => console.log(err));
              });
            });
          })

        }
      })
    }
    else if (role == "pharmacist") {
      Pharmacist.findOne({ email: email }).then((user) => {
        if (user) {
          errors.push({
            msg: "Email already exists",
          });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
            doctors
          });
        } else {
          const newUser = new Pharmacist({
            name,
            email,
            password,
            role
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  req.flash("success_msg", "Registration request sent");
                  res.redirect("/patient/dashboard");
                })
                .catch((err) => console.log(err));
            });
          });


        }
      })
    }

  }
});

// Logout
router.get("/logout", (req, res) => {
  console.log("logging out")
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});


module.exports = router;