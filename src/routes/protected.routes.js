// src/routes/protected.routes.js
const router = require("express").Router();
const ensureAuth = require("../middlewares/ensureAuth");

router.get("/", ensureAuth, (req, res) => {
  return res.json({ message: "Protected OK", user: req.user });
});

module.exports = router;
