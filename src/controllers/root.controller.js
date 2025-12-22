function getRoot(req, res) {
  return res.json({ message: "Get root route" });
}

module.exports = { getRoot };
