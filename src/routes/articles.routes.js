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

router.use(requireArticleAccess);

router.get("/", getArticles);
router.post("/", postArticles);

router.get("/:articleId", validateIdParam("articleId"), getArticleById);
router.put("/:articleId", validateIdParam("articleId"), putArticleById);
router.delete("/:articleId", validateIdParam("articleId"), deleteArticleById);

module.exports = router;
