const express = require("express");
const passport = require("passport");

const router = express.Router();

// Login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Login POST
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
  })
);

// Dashboard (protected)
router.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  res.render("dashboard", { username: req.user.username });
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;