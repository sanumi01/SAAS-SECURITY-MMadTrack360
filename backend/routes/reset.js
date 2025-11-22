const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const sendResetEmail = require('../utils/sendEmail');

const tokenStore = new Map(); // Replace with DynamoDB later

router.post('/reset/request', async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString('hex');
  tokenStore.set(token, { email, expires: Date.now() + 3600000 }); // 1 hour expiry

  try {
    await sendResetEmail(email, token);
    res.status(200).json({ message: 'Reset link sent', token });     
  } catch (err) {
    res.status(500).json({ error: 'Email failed', details: err.message });
  }
});

router.post('/reset/confirm', async (req, res) => {
  const { token, newPassword } = req.body;
  const record = tokenStore.get(token);

  if (!record || record.expires < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  // TODO: Update password in DB
  tokenStore.delete(token);
  res.status(200).json({ message: 'Password updated' });
});

module.exports = router;
