const { articles } = require("../data/articles.data");

function getArticles(req, res) {
  return res.status(200).render("articles/index.ejs", {
    title: "Articles",
    articles
  });
}

function getArticleById(req, res) {
  const { articleId } = req.params;
  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return res.status(404).type("text").send(`Article not found: ${articleId}`);
  }

  return res.status(200).render("articles/details.ejs", {
    title: `Article #${articleId}`,
    article
  });
}

module.exports = {
  getArticles,
  postArticles,
  getArticleById,
  putArticleById,
  deleteArticleById
};
