const router = require("express").Router();
router.post("/sns", (req, res) => {
  console.log("SES SNS Event:", req.body);
  res.send();
});
module.exports = router;
