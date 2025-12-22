const router = require("express").Router();
const { logRequests } = require("../middlewares/logRequests");

router.use(logRequests);

router.get("/", (req, res) => {
  return res.type("text").send("Get root route");
});

module.exports = router;
