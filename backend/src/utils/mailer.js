const { SENDGRID_API_KEY, MAIL_FROM_EMAIL, MAIL_FROM_NAME, AWS_SES_ACCESS_KEY, AWS_SES_SECRET_KEY } = process.env;

let mailer = null;
let provider = "none";

//  Prefer AWS SES if keys are valid
if (AWS_SES_ACCESS_KEY?.startsWith("AKIA") && AWS_SES_SECRET_KEY?.length > 20) {
  console.log("[MAILER] Using AWS SES");
  mailer = require("./ses");
  provider = "ses";
} else if (SENDGRID_API_KEY?.startsWith("SG.")) {
  console.log("[MAILER] Using SendGrid");
  mailer = require("./sendgrid");
  provider = "sendgrid";
} else {
  console.warn("[MAILER] No valid email provider configured. Emails will be logged only.");
  mailer = {
    sendMail: async (to, subject, html) => {
      console.log("[DEV] Email payload ->", { to, subject, html });
    }
  };
}

//  Optional: basic template rendering
function renderTemplate(name, data = {}) {
  if (name === "welcome") {
    const user = data.userName || "User";
    return `<h1>Welcome ${user}!</h1><p>Your MMadTrack360 account is ready.</p>`;
  }
  if (name === "shiftReminder") {
    const loc = data.location || "your site";
    const time = data.time || "scheduled time";
    return `<p>Your shift starts soon at <b>${loc}</b> (${time}).</p>`;
  }
  return `<p>${data.text || "Notification from MMadTrack360."}</p>`;
}

//  Optional plain-text fallback
function stripHtml(html = "") {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

async function sendTemplated(to, templateName, data = {}) {
  const subject = `MMadTrack360: ${templateName}`;
  const html = renderTemplate(templateName, data);
  await mailer.sendMail(to, subject, html);
}

module.exports = {
  sendMail: mailer.sendMail,
  sendTemplated,
  renderTemplate,
  stripHtml,
  provider
};
