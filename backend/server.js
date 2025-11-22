const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/admin", require("./routes/admin"));
app.use("/api/staff", require("./routes/staff"));
app.use("/api/reset", require("./routes/reset"));

app.listen(4000, () => {
  console.log(" MMadTrack360 backend running on http://localhost:4000");
});
app.use("/api/reset", require("./routes/reset"));
