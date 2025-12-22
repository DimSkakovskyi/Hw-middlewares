function validateIdParam(paramName) {
  return (req, res, next) => {
    const value = req.params[paramName];

    if (!value || !/^[a-zA-Z0-9_-]+$/.test(value)) {
      return res.status(400).type("text").send(`Invalid ${paramName}`);
    }

    next();
  };
}

function validateUserBody(req, res, next) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res
      .status(400)
      .type("text")
      .send("Missing required fields: username and password");
  }

  next();
}

module.exports = { validateIdParam, validateUserBody };
