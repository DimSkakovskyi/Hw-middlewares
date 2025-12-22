const { users } = require("../data/users.data");

function getUsers(req, res) {
  res.type("text").status(200).send(JSON.stringify(users, null, 2));
}

function postUsers(req, res) {
  const { username, password } = req.body;

  const newUser = {
    id: String(Date.now()),
    username,
    password
  };

  users.push(newUser);

  res
    .type("text")
    .status(201)
    .send(`User created: ${JSON.stringify(newUser)}`);
}

function getUserById(req, res) {
  const { userId } = req.params;
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.type("text").status(404).send(`User not found: ${userId}`);
  }

  res.type("text").status(200).send(`Get user by Id route: ${userId}\n${JSON.stringify(user)}`);
}

function putUserById(req, res) {
  const { userId } = req.params;
  const { username, password } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.type("text").status(404).send(`User not found: ${userId}`);
  }

  user.username = username;
  user.password = password;

  res
    .type("text")
    .status(200)
    .send(`Put user by Id route: ${userId}\nUpdated: ${JSON.stringify(user)}`);
}

function deleteUserById(req, res) {
  const { userId } = req.params;
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    return res.type("text").status(404).send(`User not found: ${userId}`);
  }

  const deleted = users.splice(index, 1)[0];

  res
    .type("text")
    .status(200)
    .send(`Delete user by Id route: ${userId}\nDeleted: ${JSON.stringify(deleted)}`);
}

module.exports = {
  getUsers,
  postUsers,
  getUserById,
  putUserById,
  deleteUserById
};
