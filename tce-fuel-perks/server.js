const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const HUB_ORIGIN = process.env.HUB_ORIGIN || "https://tceholdings.org";

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Stripe webhook stub — wire STRIPE_WEBHOOK_SECRET in production.
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(200).json({
        received: true,
        stub: true,
        message: "Webhook stub active — configure STRIPE_WEBHOOK_SECRET to verify events.",
      });
    }
    console.log("[stripe] webhook received", { signaturePresent: Boolean(signature) });
    return res.status(200).json({ received: true });
  },
);

// Mock database / state for members & affiliates
const membersDB = new Map();

app.post("/api/subscribe", (req, res) => {
  const { name, email, phone } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });

  const memberId = "FR2P-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const affiliateLink = `${HUB_ORIGIN}/fuel/ref?code=${memberId}`;

  const newMember = {
    memberId,
    name: name || "Valued Member",
    email,
    phone: phone || "",
    tier: "Standard Fuel Member ($29.99/mo)",
    status: "Active",
    joinedDate: new Date().toISOString(),
    affiliateLink,
    qrCodeApiUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(affiliateLink)}`,
  };

  membersDB.set(memberId, newMember);
  res.json({
    success: true,
    message: "Successfully enrolled in The FR2P Club Fuel Program!",
    data: newMember,
  });
});

app.get("/api/member/:id", (req, res) => {
  const member = membersDB.get(req.params.id);
  if (!member) {
    return res.json({
      memberId: req.params.id,
      name: "Derrick Taylor",
      tier: "Standard Fuel Member ($29.99/mo)",
      affiliateLink: `${HUB_ORIGIN}/fuel/ref?code=${req.params.id}`,
      qrCodeApiUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${HUB_ORIGIN}/fuel/ref?code=${req.params.id}`)}`,
    });
  }
  res.json(member);
});

app.listen(PORT, () => {
  console.log(`TCE Fuel Perks Sub-Brand running on port ${PORT}`);
});
