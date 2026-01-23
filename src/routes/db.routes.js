const router = require("express").Router();
const { renderArticlesFromDb } = require("../controllers/db.controller");

// GET /db/articles
router.get("/articles", renderArticlesFromDb);

module.exports = router;
