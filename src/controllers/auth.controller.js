// src/controllers/auth.controller.js
const passport = require("passport");
const userStore = require("../stores/userStore");

// POST /auth/register
async function register(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email & password required" });
    }

    const created = await userStore.createUser(email, password);
    if (!created) {
      return res.status(409).json({ message: "User exists" });
    }

    // одразу логінимо -> створюється сесія + cookie connect.sid
    req.login(created, (err) => {
      if (err) return next(err);
      return res.status(201).json({ message: "Registered & logged in", user: created });
    });
  } catch (err) {
    next(err);
  }
}

// POST /auth/login
function login(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });

    req.login(user, (err2) => {
      if (err2) return next(err2);
      return res.status(200).json({ message: "Logged in", user });
    });
  })(req, res, next);
}

// POST /auth/logout
function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err2) => {
      if (err2) return next(err2);

      // якщо в session config name="connect.sid"
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out" });
    });
  });
}

// GET /auth/me
function me(req, res) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.json({ user: req.user });
}

module.exports = { register, login, logout, me };
