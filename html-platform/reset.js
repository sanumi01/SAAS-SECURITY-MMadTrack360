const router = require("express").Router();
const crypto = require("crypto");
const { sendMail } = require("../utils/mailer");

const tokenStore = new Map(); // Replace with Redis/DynamoDB in production

router.post("/request", async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  tokenStore.set(token, { email, expires: Date.now() + 3600000 });
  const link = `http://localhost:4173/reset-password.html?token=${token}`;
  const html = `<p>Click to reset your password:</p><a href="${link}">${link}</a>`;
  await sendMail(email, "Reset your MMadTrack360 password", html);
  res.json({ ok: true });
});

router.post("/confirm", async (req, res) => {
  const { token, password } = req.body;
  const entry = tokenStore.get(token);
  if (!entry || entry.expires < Date.now()) return res.status(400).json({ ok: false });
  // TODO: update password in DB
  tokenStore.delete(token);
  res.json({ ok: true });
});

module.exports = router;
