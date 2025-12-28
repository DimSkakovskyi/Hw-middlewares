const router = require("express").Router();
const { authJwt } = require("../middlewares/authJwt");

router.get("/", authJwt, (req, res) => {
  return res.json({ message: "Protected OK", user: req.user });
});

module.exports = router;
