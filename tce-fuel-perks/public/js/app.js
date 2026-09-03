const HUB_ORIGIN = window.__FUEL_PERKS_CONFIG__?.hubOrigin || "https://tceholdings.org";

let currentMember = null;

function readSsoTokenFromHash() {
  const params = new URLSearchParams(location.hash.replace(/^#/, ""));
  return params.get("kk_sso");
}

function clearSsoHash() {
  if (location.hash.includes("kk_sso")) {
    history.replaceState(null, "", location.pathname + location.search);
  }
}

async function adoptHubIdentity() {
  const token = readSsoTokenFromHash();
  if (!token) return null;

  const res = await fetch("/api/auth/sso", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  clearSsoHash();

  if (!res.ok) return null;
  const data = await res.json();
  currentMember = data.member;
  sessionStorage.setItem("fuelPerksMember", JSON.stringify(data.member));
  return data;
}

function loadStoredMember() {
  try {
    const raw = sessionStorage.getItem("fuelPerksMember");
    if (raw) currentMember = JSON.parse(raw);
  } catch {
  }
  return currentMember;
}

function updateAuthBanner() {
  const el = document.getElementById("auth-banner");
  if (!el) return;

  const member = currentMember || loadStoredMember();
  if (member) {
    el.className = "status-banner";
    el.innerHTML = `Signed in as <strong>${member.displayName}</strong> · Member ID <strong>${member.id}</strong> · Tier <span class="badge">${member.tier}</span>`;
  } else {
    el.className = "status-banner signed-out";
    el.innerHTML = `Not signed in — <a href="${HUB_ORIGIN}/auth">Sign in at the TCE Hub</a> to sync your member dashboard.`;
  }
}

async function startCheckout(tier, emailInputId) {
  const emailEl = emailInputId ? document.getElementById(emailInputId) : null;
  const email = emailEl?.value?.trim() || currentMember?.email || "";

  const res = await fetch("/api/checkout/create-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tier, email }),
  });

  const data = await res.json();
  if (data.member) {
    currentMember = data.member;
    sessionStorage.setItem("fuelPerksMember", JSON.stringify(data.member));
    updateAuthBanner();
  }

  if (data.checkoutUrl) {
    window.location.href = data.checkoutUrl;
    return;
  }

  alert(data.message || data.error || "Checkout unavailable.");
}

function referralUrl(code) {
  const base = window.location.origin + window.location.pathname.replace(/[^/]+$/, "");
  return `${base}index.html?ref=${encodeURIComponent(code)}`;
}

async function renderQr(canvasId, text) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.QRCode) return;

  await window.QRCode.toCanvas(canvas, text, {
    width: 220,
    margin: 2,
    color: { dark: "#1a0a0d", light: "#ffffff" },
  });
}

function downloadCanvas(canvasId, filename) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

document.addEventListener("DOMContentLoaded", async () => {
  loadStoredMember();
  await adoptHubIdentity();
  updateAuthBanner();

  const ref = new URLSearchParams(location.search).get("ref");
  if (ref) sessionStorage.setItem("fuelPerksRef", ref);

  document.querySelectorAll("[data-checkout-tier]").forEach((btn) => {
    btn.addEventListener("click", () => {
      startCheckout(btn.dataset.checkoutTier, btn.dataset.emailInput);
    });
  });
});

window.FuelPerks = {
  adoptHubIdentity,
  loadStoredMember,
  updateAuthBanner,
  startCheckout,
  referralUrl,
  renderQr,
  downloadCanvas,
  get member() {
    return currentMember || loadStoredMember();
  },
};
