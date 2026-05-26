const express = require("express");
const passport = require("passport");

const router = express.Router();

// Login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Login POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.render("login", {
        error: info.message,
        username: req.body.username // 🔥 VERY useful for UX + SIEM
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/dashboard");
    });
  })(req, res, next);
});

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