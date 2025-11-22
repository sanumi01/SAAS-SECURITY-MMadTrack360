const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Your existing routes and logic below
// Example:
app.post("/api/reset", (req, res) => {
  const { email } = req.body;
  console.log(`[RESET] Email received: ${email}`);
  res.json({ ok: true, message: "Reset link sent (mock)." });
});

app.listen(4000, () => {
  console.log("API running on http://localhost:4000");
});
