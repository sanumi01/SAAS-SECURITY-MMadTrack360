const cron = require("node-cron");
const { sendSms } = require("../utils/sns");

cron.schedule("* * * * *", async () => {
  const message = "Reminder: Your shift starts at 9AM.";
  const recipients = ["+1234567890"]; // Add verified numbers

  for (const to of recipients) {
    await sendSms(to, message);
  }
});
