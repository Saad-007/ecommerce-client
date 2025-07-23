// /api/create-checkout-session.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
  const { items, address } = req.body;

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round((item.offerPrice || item.price) * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/orders?success=true`,
    cancel_url: `${process.env.CLIENT_URL}/cart?canceled=true`,
    metadata: {
      address: JSON.stringify(address)
    }
  });

  res.json({ sessionId: session.id });
});

module.exports = router;
