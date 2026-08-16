export type GaItem = {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_category?: string;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "tce_analytics_consent";

let measurementId: string | null = null;
let initialized = false;

function isDebugMode(): boolean {
  return (
    new URLSearchParams(window.location.search).has("ga_debug") ||
    localStorage.getItem("ga_debug") === "1"
  );
}

export function getAnalyticsConsent(): "granted" | "denied" | null {
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === "granted" || value === "denied") return value;
  return null;
}

export function setAnalyticsConsent(granted: boolean): void {
  localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
}

export function setGaMeasurementId(id: string | null | undefined): void {
  measurementId = id?.trim() || null;
}

export function isGaInitialized(): boolean {
  return initialized;
}

export function initGa4(): void {
  if (!measurementId || initialized || getAnalyticsConsent() !== "granted") {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());

  const config: Record<string, unknown> = {
    send_page_view: false,
  };
  if (isDebugMode()) {
    config.debug_mode = true;
  }

  window.gtag("config", measurementId, config);
  initialized = true;
}

export function enableAnalyticsAfterConsent(): void {
  initGa4();
}

function gtagEvent(name: string, params: Record<string, unknown>): void {
  if (!initialized || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export function trackPageView(path: string): void {
  gtagEvent("page_view", { page_path: path });
}

export function trackViewItem(
  item: GaItem,
  value?: number,
  currency = "USD",
): void {
  gtagEvent("view_item", {
    currency,
    value,
    items: [item],
  });
}

export function trackBeginCheckout(items: GaItem[], value: number): void {
  gtagEvent("begin_checkout", {
    currency: "USD",
    value,
    items,
  });
}

export function trackPurchase(
  transactionId: string,
  items: GaItem[],
  value: number,
): void {
  gtagEvent("purchase", {
    transaction_id: transactionId,
    currency: "USD",
    value,
    items,
  });
}

export function toGaItemFromCart(item: {
  priceId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  category?: string;
}): GaItem {
  return {
    item_id: item.priceId,
    item_name: item.title,
    price: item.unitPrice,
    quantity: item.quantity,
    item_category: item.category,
  };
}
