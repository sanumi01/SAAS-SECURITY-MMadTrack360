const router = require("express").Router();
const { z } = require("zod");
const { sendMail } = require("../utils/ses"); // updated from sendgrid
const { sendSms } = require("../utils/twilio");

const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().optional(),
  templateName: z.string().optional(),
  data: z.record(z.any()).optional(),
});

const smsSchema = z.object({
  to: z.string().min(3),
  message: z.string().optional(),
  templateNameOrText: z.string().optional(),
  data: z.record(z.any()).optional(),
});

function renderEmail(template, data = {}) {
  if (template === "welcome") {
    const name = data.userName || "User";
    return `<h1>Welcome ${name}!</h1><p>Your MMadTrack360 account is ready.</p>`;
  }
  if (template === "shiftReminder") {
    const loc = data.location || "your site";
    const time = data.time || "scheduled time";
    return `<p>Your shift starts soon at <b>${loc}</b> (${time}).</p>`;
  }
  return `<p>${data.text || "Notification from MMadTrack360."}</p>`;
}

function renderSms(templateOrText, data = {}) {
  if (!templateOrText) return data.text || "Notification from MMadTrack360.";
  const t = (templateOrText || "").toLowerCase();
  if (t.includes("welcome")) return "Welcome to MMadTrack360! Your account is ready.";
  if (t.includes("shift")) {
    const name = data.name || "Team";
    const loc = data.location || "site";
    const tm = data.time || "time";
    return `Hi ${name}, your shift starts soon at ${loc} (${tm}).`;
  }
  return templateOrText;
}

router.post("/email", async (req, res, next) => {
  try {
    const body = emailSchema.parse(req.body);
    const subject =
      body.subject ||
      (body.templateName ? `MMadTrack360: ${body.templateName}` : "MMadTrack360 Notification");
    const html = renderEmail(body.templateName, body.data);
    await sendMail(body.to, subject, html);
    res.json({ ok: true, sent: true });
  } catch (e) {
    next(e);
  }
});

router.post("/sms", async (req, res, next) => {
  try {
    const body = smsSchema.parse(req.body);
    const msg = body.message || renderSms(body.templateNameOrText, body.data);
    await sendSms(body.to, msg);
    res.json({ ok: true, sent: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
