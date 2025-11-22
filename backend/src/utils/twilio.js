const sg = require("@sendgrid/mail");
let client = null;

//  Twilio fallback for dev mode
if (!process.env.TWILIO_ACCOUNT_SID?.startsWith("AC")) {
  console.log("[DEV] Twilio SID missing or invalid  SMS disabled");
  module.exports = {
    sendSms: async (to, message) => {
      console.log("[DEV] SMS fallback:", { to, message });
    }
  };
  return;
}

client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM = process.env.TWILIO_FROM;

async function sendSms(to, message) {
  if (!client) {
    console.log("[DEV] Twilio not configured  printing SMS payload:", { to, message });
    return;
  }
  await client.messages.create({ to, from: FROM, body: message });
}

module.exports = { sendSms };
