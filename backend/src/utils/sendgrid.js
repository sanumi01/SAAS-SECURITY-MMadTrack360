const sg = require('@sendgrid/mail');

const FROM_EMAIL = process.env.MAIL_FROM_EMAIL;
const FROM_NAME = process.env.MAIL_FROM_NAME || 'MMadTrack360';

if (process.env.SENDGRID_API_KEY) {
sg.setApiKey(process.env.SENDGRID_API_KEY);
}

async function sendMail(to, subject, html) {
if (!process.env.SENDGRID_API_KEY) {
console.log('[DEV] SENDGRID_API_KEY missing -> printing email payload:', { to, subject, html });
return;
}
const msg = { to, from: { email: FROM_EMAIL, name: FROM_NAME }, subject, html };
await sg.send(msg);
}

module.exports = { sendMail };
