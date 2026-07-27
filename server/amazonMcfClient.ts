import type { ProviderFulfillmentItem, ShippingAddress } from "@shared/schema";

const LWA_TOKEN_URL = "https://api.amazon.com/auth/o2/token";
const DEFAULT_ENDPOINT = "https://sellingpartnerapi-na.amazon.com";
const DEFAULT_US_MARKETPLACE = "ATVPDKIKX0DER";

interface AmazonClientOptions {
  fetchImpl?: typeof fetch;
  env?: NodeJS.ProcessEnv;
}

interface AmazonSubmission {
  externalId: string;
  recipient: ShippingAddress;
  items: ProviderFulfillmentItem[];
}

let cachedToken:
  | { cacheKey: string; accessToken: string; expiresAt: number }
  | undefined;

export function amazonMcfConfigured(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return Boolean(
    env.AMAZON_LWA_CLIENT_ID &&
      env.AMAZON_LWA_CLIENT_SECRET &&
      env.AMAZON_LWA_REFRESH_TOKEN,
  );
}

async function getAccessToken(options: AmazonClientOptions): Promise<string> {
  const env = options.env ?? process.env;
  const clientId = env.AMAZON_LWA_CLIENT_ID;
  const clientSecret = env.AMAZON_LWA_CLIENT_SECRET;
  const refreshToken = env.AMAZON_LWA_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Amazon MCF requires AMAZON_LWA_CLIENT_ID, AMAZON_LWA_CLIENT_SECRET, and AMAZON_LWA_REFRESH_TOKEN",
    );
  }
  const cacheKey = `${clientId}:${refreshToken}`;
  if (
    cachedToken?.cacheKey === cacheKey &&
    cachedToken.expiresAt > Date.now() + 60_000
  ) {
    return cachedToken.accessToken;
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });
  const response = await fetchImpl(LWA_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data?.access_token) {
    throw new Error(
      data?.error_description ||
        data?.error ||
        `Amazon LWA token error (${response.status})`,
    );
  }
  const expiresIn = Math.max(60, Number(data.expires_in) || 3600);
  cachedToken = {
    cacheKey,
    accessToken: String(data.access_token),
    expiresAt: Date.now() + expiresIn * 1000,
  };
  return cachedToken.accessToken;
}

async function amazonRequest(
  path: string,
  init: RequestInit,
  options: AmazonClientOptions,
  allowNotFound = false,
): Promise<any | null> {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;
  const accessToken = await getAccessToken(options);
  const endpoint = (env.AMAZON_SP_API_ENDPOINT || DEFAULT_ENDPOINT).replace(
    /\/+$/,
    "",
  );
  const response = await fetchImpl(`${endpoint}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-amz-access-token": accessToken,
      "x-amz-date": new Date().toISOString().replace(/[:-]|\.\d{3}/g, ""),
      "User-Agent": "KhompleteKhemistriFulfillment/1.0",
      ...(init.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (allowNotFound && response.status === 404) return null;
  if (!response.ok) {
    const first = Array.isArray(data?.errors) ? data.errors[0] : undefined;
    throw new Error(
      first?.message ||
        first?.code ||
        data?.message ||
        `Amazon SP-API error (${response.status})`,
    );
  }
  return data;
}

export async function submitAmazonMcfFulfillment(
  input: AmazonSubmission,
  options: AmazonClientOptions = {},
): Promise<{ providerOrderId: string; status: string }> {
  const path = `/fba/outbound/2020-07-01/fulfillmentOrders/${encodeURIComponent(
    input.externalId,
  )}`;
  const existing = await amazonRequest(
    path,
    { method: "GET" },
    options,
    true,
  );
  if (existing?.payload?.fulfillmentOrder) {
    return {
      providerOrderId: input.externalId,
      status: String(
        existing.payload.fulfillmentOrder.fulfillmentOrderStatus || "received",
      ),
    };
  }

  const env = options.env ?? process.env;
  const body = {
    marketplaceId:
      env.AMAZON_MARKETPLACE_ID || DEFAULT_US_MARKETPLACE,
    sellerFulfillmentOrderId: input.externalId,
    displayableOrderId: input.externalId,
    displayableOrderDate: new Date().toISOString(),
    displayableOrderComment: "Thank you for your order.",
    shippingSpeedCategory: env.AMAZON_MCF_SHIPPING_SPEED || "Standard",
    fulfillmentAction: "Ship",
    fulfillmentPolicy: "FillOrKill",
    destinationAddress: {
      name: input.recipient.name,
      addressLine1: input.recipient.addressLine1,
      addressLine2: input.recipient.addressLine2,
      city: input.recipient.city,
      stateOrRegion: input.recipient.stateCode,
      countryCode: input.recipient.countryCode,
      postalCode: input.recipient.postalCode,
      phoneNumber: input.recipient.phone,
    },
    notificationEmails: input.recipient.email
      ? [input.recipient.email]
      : undefined,
    items: input.items.map((item, index) => ({
      sellerSku: item.sellerSku,
      sellerFulfillmentOrderItemId: `${input.externalId}-${index + 1}`.slice(
        0,
        50,
      ),
      quantity: item.quantity,
    })),
  };
  await amazonRequest(
    "/fba/outbound/2020-07-01/fulfillmentOrders",
    { method: "POST", body: JSON.stringify(body) },
    options,
  );
  return { providerOrderId: input.externalId, status: "received" };
}
