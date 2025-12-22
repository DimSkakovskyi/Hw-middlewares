const { articles } = require("../data/articles.data");

function getArticles(req, res) {
  return res.status(200).render("articles/index.ejs", {
    title: "Articles",
    articles
  });
}

function getArticleById(req, res) {
  const { articleId } = req.params;
  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return res.status(404).type("text").send(`Article not found: ${articleId}`);
  }

  return res.status(200).render("articles/details.ejs", {
    title: `Article #${articleId}`,
    article
  });
}

function postArticles(req, res) {
  const { title, authorId } = req.body || {};

  const id = String(Date.now());
  const newArticle = {
    id,
    title: title || `New article ${id}`,
    authorId: authorId || "1"
  };

  articles.push(newArticle);

  return res
    .status(201)
    .type("text")
    .send(`Post articles route\nCreated: ${JSON.stringify(newArticle)}`);
}

function putArticleById(req, res) {
  const { articleId } = req.params;
  const { title, authorId } = req.body || {};

  const article = articles.find((a) => a.id === articleId);
  if (!article) {
    return res.status(404).type("text").send(`Article not found: ${articleId}`);
  }

  if (title !== undefined) article.title = title;
  if (authorId !== undefined) article.authorId = authorId;

  return res
    .status(200)
    .type("text")
    .send(`Put article by Id route: ${articleId}\nUpdated: ${JSON.stringify(article)}`);
}

function deleteArticleById(req, res) {
  const { articleId } = req.params;
  const index = articles.findIndex((a) => a.id === articleId);

  if (index === -1) {
    return res.status(404).type("text").send(`Article not found: ${articleId}`);
  }

  const deleted = articles.splice(index, 1)[0];

  return res
    .status(200)
    .type("text")
    .send(`Delete article by Id route: ${articleId}\nDeleted: ${JSON.stringify(deleted)}`);
}

module.exports = {
  getArticles,
  postArticles,
  getArticleById,
  putArticleById,
  deleteArticleById
};
