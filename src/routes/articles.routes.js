const router = require("express").Router();
const { requireArticleAccess } = require("../middlewares/articleAccess");
const { validateIdParam } = require("../middlewares/validate");

const {
  getArticles,
  getArticleById,

  insertOneArticle,      // POST /articles
  insertManyArticles,    // POST /articles/bulk

  updateOneArticle,      // PATCH /articles/:articleId
  updateManyArticles,    // PATCH /articles

  replaceOneArticle,     // PUT /articles/:articleId

  deleteOneArticle,      // DELETE /articles/:articleId
  deleteManyArticles,     // DELETE /articles

  getArticlesCursor,
  getArticlesStats
} = require("../controllers/articles.controller");
const { validateLimitQuery } = require("../middlewares/validateQuery");

// READ
router.get("/", validateLimitQuery(20, 100), getArticles);
router.get("/cursor", getArticlesCursor);
router.get("/stats", getArticlesStats);
router.get("/:articleId", validateIdParam("articleId"), getArticleById);


// CREATE
router.post("/", requireArticleAccess, insertOneArticle);          // insertOne
router.post("/bulk", requireArticleAccess, insertManyArticles);    // insertMany

// UPDATE
router.patch("/", requireArticleAccess, updateManyArticles); // updateMany (filter in body)
router.patch("/:articleId", requireArticleAccess, validateIdParam("articleId"), updateOneArticle); // updateOne

router.put("/:articleId", requireArticleAccess, validateIdParam("articleId"), replaceOneArticle); // replaceOne

// DELETE
router.delete("/", requireArticleAccess, deleteManyArticles); // deleteMany (filter in body)
router.delete("/:articleId", requireArticleAccess, validateIdParam("articleId"), deleteOneArticle); // deleteOne

module.exports = router;
