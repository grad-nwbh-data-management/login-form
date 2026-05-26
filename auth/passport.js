const LocalStrategy = require("passport-local").Strategy;
const fs = require("fs");
const path = require("path");

// Fake users
const users = [
  { id: 1, username: "admin", password: "admin123" },
  { id: 2, username: "student", password: "student123" }
];

module.exports = function (passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      const user = users.find((u) => u.username === username);

      const logEntry = {
        timestamp: new Date().toISOString(),
        event: "login_attempt",
        username,
        success: false
      };

      if (!user || user.password !== password) {
        logEntry.success = false;

        fs.appendFileSync(
          path.join(__dirname, "../logs/app.log"),
          JSON.stringify(logEntry) + "\n"
        );

        return done(null, false, { message: "Invalid credentials" });
      }

      logEntry.success = true;

      fs.appendFileSync(
        path.join(__dirname, "../logs/app.log"),
        JSON.stringify(logEntry) + "\n"
      );

      return done(null, user);
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = users.find((u) => u.id === id);
    done(null, user);
  });
};