const router = require("express").Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@demo.com" && password === "admin123") {
    res.json({ ok: true, user: { role: "admin", email } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log("[ADMIN SIGNUP]", email, password);
  res.json({ ok: true });
});

module.exports = router;
