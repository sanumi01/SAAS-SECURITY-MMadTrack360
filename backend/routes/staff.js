const router = require("express").Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "staff@demo.com" && password === "staff123") {
    res.json({ ok: true, user: { role: "staff", email } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

module.exports = router;
