# Navigate to backend folder
cd "C:\Users\pryan\OneDrive\Desktop\SAAS PROJECTS\SAAS For MMadTrack360-Security3\backend"

#  Add password reset route (SES magic link)
@"
const router = require('express').Router();
const crypto = require('crypto');
const { sendMail } = require('../utils/mailer');

router.post('/reset-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(32).toString('hex');
    const link = \`http://localhost:4173/reset-password.html?token=\${token}\`;
    const html = \`<p>Click to reset your password:</p><a href="\${link}">\${link}</a>\`;
    await sendMail(email, 'Reset your MMadTrack360 password', html);
    res.json({ ok: true, sent: true });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
"@ | Out-File -FilePath "src\routes\reset.js" -Encoding utf8

#  Wire route into server.js
(Get-Content "src\server.js") -replace "// Routes", "// Routes`napp.use('/api/reset', require('./routes/reset'));" |
  Set-Content "src\server.js"

#  Add shift reminder job (SNS via node-cron)
@"
const cron = require('node-cron');
const { sendSms } = require('./utils/sns');

cron.schedule('0 8 * * *', async () => {
  const message = 'Reminder: Your shift starts at 9AM.';
  const recipients = ['+1234567890']; // Add verified numbers
  for (const to of recipients) {
    await sendSms(to, message);
  }
});
"@ | Out-File -FilePath "src\jobs\shiftReminder.js" -Encoding utf8

#  Wire job into server.js
Add-Content "src\server.js" 'require("./jobs/shiftReminder");'

#  Add Stripe billing section to dashboard.html
cd "..\html-platform"
Add-Content "dashboard.html" @"
<section id='stripe'>
  <h2>Stripe Billing</h2>
  <p>Choose your plan:</p>
  <button onclick="startStripeCheckout('basic')">Basic</button>
  <button onclick="startStripeCheckout('pro')">Pro</button>
  <button onclick="startStripeCheckout('enterprise')">Enterprise</button>
</section>
<script>
function startStripeCheckout(plan) {
  alert('Stripe checkout for ' + plan + ' plan would launch here.');
}
</script>
"@

Write-Host "`n Enterprise features added: password reset, shift reminders, and Stripe billing scaffolded." -ForegroundColor Green
