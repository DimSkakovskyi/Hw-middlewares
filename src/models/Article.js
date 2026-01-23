const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, default: "" }
  },
  { timestamps: true }
);

// Назва моделі: Article, колекція: articles
module.exports = mongoose.model("Article", articleSchema);
