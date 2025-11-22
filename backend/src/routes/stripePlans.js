const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/plans", async (req, res) => {
  const prices = await stripe.prices.list({ active: true });
  res.json(prices.data);
});

module.exports = router;
