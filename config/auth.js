module.exports = {
    ensureAuthenticated: function (req, res, next) {
      console.log("in ensure")
      if (req.isAuthenticated()) {
        return next();
      }
      console.log("not authenticated")

      req.flash("error_msg", "Please log in to view that resource");
      res.redirect("/");
    },
    forwardAuthenticated: function (req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      if (req.user.role === "doctor") {
        // res.redirect("/teacherdashboard");
        console.log("DOCTORRRRRRRR")
      } else if (req.user.role == "patient") {
        console.log("PATIENT")
        // res.redirect("/admindashboard");
      } else {
        console.log("ERROR")
      }
    },
  };