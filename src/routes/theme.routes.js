const router = require("express").Router();

router.post("/", (req, res) => {
  const { theme } = req.body; // 'light' або 'dark'
  if (!["light", "dark"].includes(theme)) {
    return res.status(400).json({ message: "theme must be light or dark" });
  }

  res.cookie("theme", theme, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: "lax"
  });

  return res.json({ message: "Theme saved", theme });
});

router.get("/", (req, res) => {
  return res.json({ theme: req.cookies.theme || "light" });
});

module.exports = router;
