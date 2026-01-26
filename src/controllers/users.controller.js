const bcrypt = require("bcryptjs");
const User = require("../models/User");

// helper: theme (якщо cookies немає — просто light)
function getTheme(req) {
  return (req.cookies && req.cookies.theme) ? req.cookies.theme : "light";
}

function sanitizeUser(u) {
  if (!u) return u;
  const { passwordHash, ...safe } = u;
  return safe;
}

// GET /users?limit=20
async function getUsers(req, res, next) {
  try {
    const theme = getTheme(req);

    let limit = parseInt(req.query.limit, 10);
    if (Number.isNaN(limit) || limit <= 0) limit = 20;
    if (limit > 100) limit = 100;

    const users = await User.find({})
      .select("username createdAt updatedAt")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).render("users/index.pug", {
      theme,
      title: "Users",
      users
    });
  } catch (err) {
    next(err);
  }
}

// GET /users/:userId
async function getUserById(req, res, next) {
  try {
    const theme = getTheme(req);
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("username createdAt updatedAt")
      .lean();

    if (!user) {
      return res.status(404).type("text").send(`User not found: ${userId}`);
    }

    return res.status(200).render("users/details.pug", {
      theme,
      title: `User #${userId}`,
      user
    });
  } catch (err) {
    next(err);
  }
}

// POST /users  body: { username, password }
async function postUsers(req, res, next) {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await User.create({ username, passwordHash });

    return res.status(201).json({
      message: "User created",
      user: sanitizeUser(created.toObject())
    });
  } catch (err) {
    next(err);
  }
}

// PUT /users/:userId  body: { username, password? }
// Повна заміна документа (replaceOne). Якщо password не передали — залишаємо старий hash.
async function putUserById(req, res, next) {
  try {
    const { userId } = req.params;
    const { username, password } = req.body || {};

    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }

    const existing = await User.findById(userId).lean();
    if (!existing) {
      return res.status(404).type("text").send(`User not found: ${userId}`);
    }

    let passwordHash = existing.passwordHash;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "password must be at least 6 characters" });
      }
      passwordHash = await bcrypt.hash(password, 10);
    }

    const result = await User.replaceOne(
      { _id: userId },
      { username, passwordHash }
    ); // replaceOne

    return res.status(200).json({ message: "User replaced", result });
  } catch (err) {
    next(err);
  }
}

// DELETE /users/:userId
async function deleteUserById(req, res, next) {
  try {
    const { userId } = req.params;

    const result = await User.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      return res.status(404).type("text").send(`User not found: ${userId}`);
    }

    return res.status(200).json({ message: "User deleted", result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUserById,
  postUsers,
  putUserById,
  deleteUserById
};
