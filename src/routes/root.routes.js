const router = require("express").Router();
const { logRequests } = require("../middlewares/logRequests");

router.use(logRequests);

router.get("/", (req, res) => {
  res.type("text").send("Get root route");
});

module.exports = router;
