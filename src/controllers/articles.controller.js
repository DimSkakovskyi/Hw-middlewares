const { articles } = require("../data/articles.data");

function getArticles(req, res) {
  res.type("text").status(200).send(JSON.stringify(articles, null, 2));
}

function postArticles(req, res) {
  const newArticle = {
    id: String(Date.now()),
    title: "New Article",
    authorId: "1"
  };

  articles.push(newArticle);

  res
    .type("text")
    .status(201)
    .send(`Article created: ${JSON.stringify(newArticle)}`);
}

function getArticleById(req, res) {
  const { articleId } = req.params;
  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return res.type("text").status(404).send(`Article not found: ${articleId}`);
  }

  res
    .type("text")
    .status(200)
    .send(`Get article by Id route: ${articleId}\n${JSON.stringify(article)}`);
}

function putArticleById(req, res) {
  const { articleId } = req.params;
  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return res.type("text").status(404).send(`Article not found: ${articleId}`);
  }

  if (req.body && req.body.title) {
    article.title = req.body.title;
  }

  res
    .type("text")
    .status(200)
    .send(`Put article by Id route: ${articleId}\nUpdated: ${JSON.stringify(article)}`);
}

function deleteArticleById(req, res) {
  const { articleId } = req.params;
  const index = articles.findIndex(a => a.id === articleId);

  if (index === -1) {
    return res.type("text").status(404).send(`Article not found: ${articleId}`);
  }

  const deleted = articles.splice(index, 1)[0];

  res
    .type("text")
    .status(200)
    .send(`Delete article by Id route: ${articleId}\nDeleted: ${JSON.stringify(deleted)}`);
}

module.exports = {
  getArticles,
  postArticles,
  getArticleById,
  putArticleById,
  deleteArticleById
};
