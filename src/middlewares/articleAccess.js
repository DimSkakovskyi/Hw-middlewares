function requireArticleAccess(req, res, next) {
  const role = (req.headers["x-role"] || "").toString().toLowerCase();

  if (role !== "admin" && role !== "editor") {
    return res
      .status(403)
      .type("text")
      .send("Forbidden. Not enough permissions to access articles.");
  }

  next();
}

module.exports = { requireArticleAccess };
