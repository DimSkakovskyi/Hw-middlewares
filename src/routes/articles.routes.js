const router = require("express").Router();
const { requireArticleAccess } = require("../middlewares/articleAccess");
const { validateIdParam } = require("../middlewares/validate");

const {
  getArticles,
  postArticles,
  getArticleById,
  putArticleById,
  deleteArticleById
} = require("../controllers/articles.controller");

router.get("/", getArticles);
router.get("/:articleId", validateIdParam("articleId"), getArticleById);

router.post("/", requireArticleAccess, postArticles);
router.put("/:articleId", requireArticleAccess, validateIdParam("articleId"), putArticleById);
router.delete("/:articleId", requireArticleAccess, validateIdParam("articleId"), deleteArticleById);

module.exports = router;
