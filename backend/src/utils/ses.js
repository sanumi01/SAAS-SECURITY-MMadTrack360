const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const accessKey = process.env.AWS_SES_ACCESS_KEY || "";
const secretKey = process.env.AWS_SES_SECRET_KEY || "";
const region = process.env.AWS_REGION || "us-west-2";
const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || "noreply@example.com";
const FROM_NAME = process.env.MAIL_FROM_NAME || "MMadTrack360";

let ses = null;

if (accessKey.startsWith("AKIA") && secretKey.length > 20) {
  ses = new SESClient({
    region,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey
    }
  });
} else {
  console.warn("[DEV] SES disabled (missing/invalid AWS credentials). Emails will be logged only.");
}

async function sendMail(to, subject, html) {
  if (!ses) {
    console.log("[DEV] SES email payload ->", { to, subject, html });
    return;
  }

  const params = {
    Destination: { ToAddresses: [to] },
    Message: {
      Body: { Html: { Charset: "UTF-8", Data: html } },
      Subject: { Charset: "UTF-8", Data: subject }
    },
    Source: `${FROM_NAME} <${FROM_EMAIL}>`
  };

  try {
    const command = new SendEmailCommand(params);
    const result = await ses.send(command);
    console.log(" SES email sent:", result.MessageId);
  } catch (err) {
    console.error(" SES sendMail error:", err);
  }
}

module.exports = { sendMail };
