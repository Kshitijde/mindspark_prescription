const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const Doctor = require("../models/doctor");
const Patient=require("../models/patient");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({
      usernameField: "email"
    }, (email, password, done) => {
      // Match user
      console.log('in authentication process...')
      Doctor.findOne({
        email: email,
      }).then((doctor) => {
        Patient.findOne({
            email: email,
        }).then((patient) => {

            if (!doctor && !patient) {
            return done(null, false, {
                message: "That email is not registered"
            });
            }
            var user;
            if(!doctor)
            {
                user=patient;
            }
            else
            {
                user=doctor;
            }
            console.log("user in auth process is...",user)
            bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                console.log("password matched!!")
                return done(null, user);
            } else {
              console.log("incorrect password")
                return done(null, false, {
                message: "Password incorrect"
                });
            }
            });


      });
     


      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    Doctor.findById(id, function (err, doctor) {
        if(!doctor)
        {
            Patient.findById(id, function (err, patient) {
                done(err, patient);
            })
        }
        else
        {
          done(err, doctor);
        }
      
    });
  });
};