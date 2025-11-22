const express = require("express");
const router = express.Router();

// POST /api/reset
router.post("/", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  // Simulate reset logic
  console.log(`Reset requested for ${email}`);
  res.json({ message: "Reset link sent to email" });
});

module.exports = router;
