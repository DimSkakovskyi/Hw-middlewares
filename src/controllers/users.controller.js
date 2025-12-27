const { users } = require("../data/users.data");

function getUsers(req, res) {
  const theme = req.cookies.theme || "light";

  return res.status(200).render("users/index.pug", {
    theme: theme,
    title: "Users",
    users
  });
}

function getUserById(req, res) {
  const { userId } = req.params;
  const user = users.find((u) => u.id === userId);
  const theme = req.cookies.theme || "light";

  if (!user) {
    return res.status(404).type("text").send(`User not found: ${userId}`);
  }

  return res.status(200).render("users/details.pug", {
    theme: theme,
    title: `User #${userId}`,
    user
  });
}

function postUsers(req, res) {
  const { username, password } = req.body;

  const id = String(Date.now());
  const newUser = { id, username, password };
  users.push(newUser);

  return res
    .status(201)
    .type("text")
    .send(`Post users route\nCreated: ${JSON.stringify(newUser)}`);
}

function putUserById(req, res) {
  const { userId } = req.params;
  const { username, password } = req.body;

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).type("text").send(`User not found: ${userId}`);
  }

  user.username = username;
  user.password = password;

  return res
    .status(200)
    .type("text")
    .send(`Put user by Id route: ${userId}\nUpdated: ${JSON.stringify(user)}`);
}

function deleteUserById(req, res) {
  const { userId } = req.params;
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).type("text").send(`User not found: ${userId}`);
  }

  const deleted = users.splice(index, 1)[0];

  return res
    .status(200)
    .type("text")
    .send(`Delete user by Id route: ${userId}\nDeleted: ${JSON.stringify(deleted)}`);
}

module.exports = {
  getUsers,
  getUserById,
  postUsers,
  putUserById,
  deleteUserById
};
