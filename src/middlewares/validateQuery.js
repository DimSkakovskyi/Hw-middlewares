function validateLimitQuery(defaultValue = 20, maxValue = 100) {
  return (req, res, next) => {
    let limit = parseInt(req.query.limit, 10);

    if (Number.isNaN(limit) || limit <= 0) limit = defaultValue;
    if (limit > maxValue) limit = maxValue;

    req.query.limit = limit;
    next();
  };
}

module.exports = { validateLimitQuery };
