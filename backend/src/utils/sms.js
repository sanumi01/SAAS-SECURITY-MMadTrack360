let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}
const FROM = process.env.TWILIO_FROM;

async function sendSms(to, message) {
  if (!client) {
    console.log("[DEV] Twilio not configured -> printing SMS payload:", { to, message });
    return;
  }
  await client.messages.create({ to, from: FROM, body: message });
}

module.exports = { sendSms };
