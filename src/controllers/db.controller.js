const Article = require("../models/Article");

async function renderArticlesFromDb(req, res, next) {
  try {
    const articles = await Article.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.render("db/articles", {
      title: "Articles from MongoDB Atlas",
      articles
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { renderArticlesFromDb };
