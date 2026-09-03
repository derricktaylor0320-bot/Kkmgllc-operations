require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT) || 3100;
const HUB_ORIGIN = process.env.HUB_ORIGIN || "https://tceholdings.org";
const APP_URL = (process.env.APP_URL || `http://localhost:${PORT}`).replace(/\/$/, "");

const app = express();

app.use(
  cors({
    origin: [HUB_ORIGIN, APP_URL, "http://localhost:3100"],
    credentials: true,
  }),
);

// Stripe webhook must receive the raw body before JSON parsing.
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const signature = req.headers["stripe-signature"];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
      console.warn("[stripe] webhook received but STRIPE_WEBHOOK_SECRET is not set");
      return res.status(200).json({
        received: true,
        stub: true,
        message: "Webhook stub active — configure STRIPE_WEBHOOK_SECRET to verify events.",
      });
    }

    // Production: verify with stripe.webhooks.constructEvent(req.body, signature, secret)
  console.log("[stripe] webhook event received", {
      signaturePresent: Boolean(signature),
      bytes: req.body?.length ?? 0,
    });

    return res.status(200).json({ received: true });
  },
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const members = new Map();

function makeMemberId() {
  return `FP-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

function getOrCreateMember(email, displayName) {
  const key = email.toLowerCase();
  if (members.has(key)) return members.get(key);

  const member = {
    id: makeMemberId(),
    email,
    displayName: displayName || email.split("@")[0],
    tier: "starter",
    referralCode: crypto.randomBytes(3).toString("hex").toUpperCase(),
    gallonsSaved: 0,
    perksBalance: 0,
    createdAt: new Date().toISOString(),
  };
  members.set(key, member);
  return member;
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "tce-fuel-perks",
    version: "1.0.0",
    hubOrigin: HUB_ORIGIN,
  });
});

app.get("/api/config", (_req, res) => {
  res.json({
    hubOrigin: HUB_ORIGIN,
    appUrl: APP_URL,
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    tiers: [
      { id: "starter", name: "Road Starter", price: 19, centsPerGallon: 5 },
      { id: "pro", name: "Fleet Pro", price: 49, centsPerGallon: 10 },
      { id: "elite", name: "Empire Elite", price: 99, centsPerGallon: 15 },
    ],
  });
});

app.post("/api/auth/sso", async (req, res) => {
  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ valid: false, error: "Missing token" });
  }

  try {
    const verifyRes = await fetch(`${HUB_ORIGIN}/api/auth/sso/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!verifyRes.ok) {
      const err = await verifyRes.json().catch(() => ({}));
      return res.status(401).json({
        valid: false,
        error: err.error || "Token verification failed",
      });
    }

    const { user } = await verifyRes.json();
    const member = getOrCreateMember(user.email, user.displayName || user.name);
    return res.json({ valid: true, user, member });
  } catch (error) {
    console.error("[sso] verify failed", error);
    return res.status(502).json({ valid: false, error: "Hub SSO unavailable" });
  }
});

app.get("/api/member/:email", (req, res) => {
  const member = members.get(req.params.email.toLowerCase());
  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }
  res.json({ member });
});

app.post("/api/checkout/create-session", (req, res) => {
  const { tier = "starter", email } = req.body || {};

  if (!process.env.STRIPE_SECRET_KEY) {
    const member = email ? getOrCreateMember(email) : null;
    if (member) member.tier = tier;
    return res.json({
      stub: true,
      message: "Stripe not configured — membership activated in demo mode.",
      checkoutUrl: `${APP_URL}/dashboard.html?tier=${encodeURIComponent(tier)}`,
      member,
    });
  }

  // Production: create Stripe Checkout Session with STRIPE_SECRET_KEY
  return res.status(501).json({
    error: "Stripe checkout wiring pending — set STRIPE_SECRET_KEY and STRIPE_PRICE_ID.",
  });
});

app.get("/dashboard", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/assets", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "assets.html"));
});

app.listen(PORT, () => {
  console.log(`TCE Fuel Perks listening on ${APP_URL} (port ${PORT})`);
});
