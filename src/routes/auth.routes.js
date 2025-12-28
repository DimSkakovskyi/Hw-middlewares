const router = require("express").Router();
const jwt = require("jsonwebtoken");

const users = new Map();
let idSeq = 1;

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
  );
}

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "email & password required" });
  if (users.has(email)) return res.status(409).json({ message: "User exists" });

  const user = { id: idSeq++, email, password };
  users.set(email, user);

  const token = signToken(user);
  res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false });
  return res.status(201).json({ message: "Registered (token in httpOnly cookie)" });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);
  if (!user || user.password !== password) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);
  res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false });
  return res.json({ message: "Logged in (token in httpOnly cookie)" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
});

module.exports = router;
