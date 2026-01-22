// src/stores/userStore.js
const bcrypt = require("bcryptjs");

let nextId = 1;
// in-memory store: email -> { id, email, passwordHash }
const users = new Map();

async function createUser(email, password) {
  if (users.has(email)) return null;

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: nextId++, email, passwordHash };
  users.set(email, user);

  // повертаємо без passwordHash
  return { id: user.id, email: user.email };
}

function findByEmail(email) {
  return users.get(email) || null;
}

function findById(id) {
  for (const u of users.values()) {
    if (u.id === Number(id)) return u;
  }
  return null;
}

async function validatePassword(email, password) {
  const user = findByEmail(email);
  if (!user) return false;
  return bcrypt.compare(password, user.passwordHash);
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  validatePassword
};
