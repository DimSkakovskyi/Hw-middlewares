const Article = require("../models/Article");

// helpers
function parseLimit(value, def = 20, max = 100) {
  let limit = parseInt(value, 10);
  if (Number.isNaN(limit) || limit <= 0) limit = def;
  if (limit > max) limit = max;
  return limit;
}

function parseFields(fieldsStr) {
  // fields=title,text -> "title text"
  if (!fieldsStr) return null;
  const cleaned = fieldsStr
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (cleaned.length === 0) return null;

  // дозволяємо тільки певні поля
  const allowed = new Set(["title", "text", "createdAt", "updatedAt"]);
  const safe = cleaned.filter(f => allowed.has(f));
  return safe.length ? safe.join(" ") : null;
}

/* =========================
   READ (find + projection)
========================= */

// GET /articles?limit=20&fields=title,text
async function getArticles(req, res, next) {
  try {
    const limit = parseLimit(req.query.limit, 20, 100);
    const fields = parseFields(req.query.fields); // projection через select

    let query = Article.find({}).sort({ createdAt: -1 }).limit(limit);

    if (fields) query = query.select(fields);

    const articles = await query.lean();

    return res.json({ limit, fields: fields || null, items: articles });
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
      title: article.title || "Article details",
      article
    });
  } catch (err) {
    next(err);
  }
}

/* =========================
   CREATE (insertOne/Many)
========================= */

// POST /articles  body: { title, text }
async function insertOneArticle(req, res, next) {
  try {
    const { title, text } = req.body || {};
    if (!title) return res.status(400).json({ message: "title is required" });

    const doc = await Article.create({ title, text: text || "" }); // insertOne
    return res.status(201).json({ message: "Inserted one", item: doc });
  } catch (err) {
    next(err);
  }
}

// POST /articles/bulk  body: { items: [{title,text}, ...] }
async function insertManyArticles(req, res, next) {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items must be a non-empty array" });
    }

    const normalized = items.map(it => ({
      title: it.title,
      text: it.text || ""
    })).filter(it => !!it.title);

    if (normalized.length === 0) {
      return res.status(400).json({ message: "each item must have title" });
    }

    const docs = await Article.insertMany(normalized); // insertMany
    return res.status(201).json({ message: "Inserted many", count: docs.length, items: docs });
  } catch (err) {
    next(err);
  }
}

/* =========================
   UPDATE (updateOne/Many + replaceOne)
========================= */

// PATCH /articles/:articleId  body: { set: { title?, text? } }
async function updateOneArticle(req, res, next) {
  try {
    const { articleId } = req.params;
    const { set } = req.body || {};

    if (!set || typeof set !== "object") {
      return res.status(400).json({ message: "body must contain { set: { ... } }" });
    }

    const result = await Article.updateOne(
      { _id: articleId },
      { $set: set }
    ); // updateOne

    return res.json({ message: "Updated one", result });
  } catch (err) {
    next(err);
  }
}

// PATCH /articles  body: { filter: {...}, set: {...} }
async function updateManyArticles(req, res, next) {
  try {
    const { filter, set } = req.body || {};
    if (!filter || typeof filter !== "object") {
      return res.status(400).json({ message: "body must contain { filter: {...}, set: {...} }" });
    }
    if (!set || typeof set !== "object") {
      return res.status(400).json({ message: "body must contain { set: {...} }" });
    }

    const result = await Article.updateMany(filter, { $set: set }); // updateMany
    return res.json({ message: "Updated many", result });
  } catch (err) {
    next(err);
  }
}

// PUT /articles/:articleId  body: { title, text }
async function replaceOneArticle(req, res, next) {
  try {
    const { articleId } = req.params;
    const { title, text } = req.body || {};

    if (!title) return res.status(400).json({ message: "title is required" });

    const result = await Article.replaceOne(
      { _id: articleId },
      { title, text: text || "" }
    ); // replaceOne

    return res.json({ message: "Replaced one", result });
  } catch (err) {
    next(err);
  }
}

/* =========================
   DELETE (deleteOne/Many)
========================= */

// DELETE /articles/:articleId
async function deleteOneArticle(req, res, next) {
  try {
    const { articleId } = req.params;

    const result = await Article.deleteOne({ _id: articleId }); // deleteOne
    return res.json({ message: "Deleted one", result });
  } catch (err) {
    next(err);
  }
}

// DELETE /articles  body: { filter: {...} }
async function deleteManyArticles(req, res, next) {
  try {
    const { filter } = req.body || {};
    if (!filter || typeof filter !== "object") {
      return res.status(400).json({ message: "body must contain { filter: {...} }" });
    }

    const result = await Article.deleteMany(filter); // deleteMany
    return res.json({ message: "Deleted many", result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getArticles,
  getArticleById,

  insertOneArticle,
  insertManyArticles,

  updateOneArticle,
  updateManyArticles,
  replaceOneArticle,

  deleteOneArticle,
  deleteManyArticles
};
