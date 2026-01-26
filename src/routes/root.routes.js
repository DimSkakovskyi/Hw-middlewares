const router = require("express").Router();
const { logRequests } = require("../middlewares/logRequests");

router.use(logRequests);

router.get("/", (req, res) => {
  return res.type("text").send("Get new root route"); в
});

module.exports = router;
