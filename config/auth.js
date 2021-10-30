module.exports = {
    ensureAuthenticated: function (req, res, next) {
      console.log("in ensure")
      if (req.isAuthenticated()) {
        return next();
      }
      console.log("not authenticated")

      req.flash("error_msg", "Please log in to view that resource");
      res.redirect("/login");
    },
    forwardAuthenticated: function (req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      if (req.user.role === "doctor") {
        res.redirect("/doctor/doctorDashboard");
        console.log("DOCTORRRRRRRR")
      } else if (req.user.role == "patient") {
        console.log("PATIENT")
        res.redirect("/patient/dashboard");
      }
        else if (req.user.role == "pharmacist") {
          console.log("PHARMACIST")
          res.redirect("/pharmacist/dashboard");
      } else {
        console.log("ERROR")
      }
    },
  };