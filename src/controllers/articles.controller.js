const Article = require("../models/Article");

// GET /articles?limit=20
async function getArticles(req, res, next) {
  try {
    // limit з query: /articles?limit=10
    let limit = parseInt(req.query.limit, 10);

    if (Number.isNaN(limit) || limit <= 0) limit = 20;
    if (limit > 100) limit = 100;

    const articles = await Article.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.render("articles/index", {
      title: "Articles",
      articles,
      limit
    });
  } catch (err) {
    next(err);
  }
}

// GET /articles/:articleId
async function getArticleById(req, res, next) {
  try {
    const { articleId } = req.params;

    const article = await Article.findById(articleId).lean();
    if (!article) return res.status(404).type("text").send("Article not found");

    return res.render("articles/details", {
      title: article.title || "Article",
      article
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getArticles,
  getArticleById
};
