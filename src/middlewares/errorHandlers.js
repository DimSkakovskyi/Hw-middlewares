function notFoundHandler(req, res, next) {
  res.status(404).type("text").send("Route not found");
}

function errorHandler(err, req, res, next) {
  res.status(500).type("text").send("Internal Server Error");
}

module.exports = { notFoundHandler, errorHandler };
