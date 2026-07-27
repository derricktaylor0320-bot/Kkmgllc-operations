import type { ProviderFulfillmentItem, ShippingAddress } from "@shared/schema";

const PRINTFUL_API_BASE = "https://api.printful.com";

export interface PrintfulVariantReference {
  syncVariantId?: number;
  externalVariantId?: string;
  variantId?: number;
  files?: Array<{ type?: string; url: string }>;
}

interface PrintfulClientOptions {
  fetchImpl?: typeof fetch;
  env?: NodeJS.ProcessEnv;
}

interface PrintfulSubmission {
  externalId: string;
  recipient: ShippingAddress;
  items: ProviderFulfillmentItem[];
}

function printfulHeaders(env: NodeJS.ProcessEnv): Record<string, string> {
  const token = env.PRINTFUL_API_TOKEN;
  if (!token) throw new Error("PRINTFUL_API_TOKEN is not configured");
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  if (env.PRINTFUL_STORE_ID) headers["X-PF-Store-Id"] = env.PRINTFUL_STORE_ID;
  return headers;
}

async function printfulRequest(
  path: string,
  init: RequestInit,
  options: PrintfulClientOptions,
  allowNotFound = false,
): Promise<any | null> {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(`${PRINTFUL_API_BASE}${path}`, {
    ...init,
    headers: {
      ...printfulHeaders(env),
      ...(init.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (allowNotFound && response.status === 404) return null;
  if (!response.ok) {
    const message =
      data?.result ||
      data?.error?.message ||
      data?.message ||
      `Printful API error (${response.status})`;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }
  return data;
}

export function printfulConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.PRINTFUL_API_TOKEN);
}

function variantText(variant: any): string {
  return [
    variant?.name,
    variant?.external_id,
    variant?.product?.name,
    variant?.size,
    variant?.color,
  ]
    .filter((value) => typeof value === "string")
    .join(" | ");
}

function containsSelection(text: string, selection: string): boolean {
  const wanted = selection.trim().toLowerCase();
  if (!wanted) return true;
  const segments = text
    .toLowerCase()
    .split(/[|/(),:[\]{}]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return segments.includes(wanted);
}

// Resolve an existing Printful sync variant without requiring a mapping when
// the Printful product name (or external ID) mirrors this site's catalog.
// Ambiguous matches are rejected instead of guessing a color or size.
export async function discoverPrintfulVariant(
  product: {
    name: string;
    catalogPriceId?: string;
    selectedSize?: string;
    selectedColor?: string;
  },
  options: PrintfulClientOptions = {},
): Promise<PrintfulVariantReference | null> {
  let offset = 0;
  let matchedProduct: any = null;
  while (offset < 1000 && !matchedProduct) {
    const data = await printfulRequest(
      `/store/products?limit=100&offset=${offset}`,
      { method: "GET" },
      options,
    );
    const products: any[] = Array.isArray(data?.result) ? data.result : [];
    matchedProduct =
      products.find(
        (candidate) =>
          product.catalogPriceId &&
          String(candidate?.external_id || "") === product.catalogPriceId,
      ) ||
      products.find(
        (candidate) =>
          String(candidate?.name || "").trim().toLowerCase() ===
          product.name.trim().toLowerCase(),
      );
    if (matchedProduct || products.length < 100) break;
    offset += products.length;
  }
  if (!matchedProduct?.id) return null;

  const details = await printfulRequest(
    `/store/products/${encodeURIComponent(String(matchedProduct.id))}`,
    { method: "GET" },
    options,
  );
  const variants: any[] = Array.isArray(details?.result?.sync_variants)
    ? details.result.sync_variants
    : [];
  const matches = variants.filter((variant) => {
    const text = variantText(variant);
    return (
      (!product.selectedSize ||
        containsSelection(text, product.selectedSize)) &&
      (!product.selectedColor ||
        containsSelection(text, product.selectedColor))
    );
  });
  if (matches.length !== 1 || !Number.isFinite(Number(matches[0]?.id))) {
    return null;
  }
  return { syncVariantId: Number(matches[0].id) };
}

export async function submitPrintfulFulfillment(
  input: PrintfulSubmission,
  options: PrintfulClientOptions = {},
): Promise<{ providerOrderId: string; status: string }> {
  const orderPath = `/orders/@${encodeURIComponent(input.externalId)}`;
  let existing = await printfulRequest(
    orderPath,
    { method: "GET" },
    options,
    true,
  );
  if (existing?.result) {
    const status = String(existing.result.status || "unknown").toLowerCase();
    if (status === "draft") {
      existing = await printfulRequest(
        `${orderPath}/confirm`,
        { method: "POST" },
        options,
      );
    } else if (status === "failed" || status === "canceled") {
      throw new Error(`Existing Printful order is ${status}`);
    }
    return {
      providerOrderId: String(existing?.result?.id ?? input.externalId),
      status: String(existing?.result?.status || status),
    };
  }

  const body = {
    external_id: input.externalId,
    shipping: "STANDARD",
    recipient: {
      name: input.recipient.name,
      address1: input.recipient.addressLine1,
      address2: input.recipient.addressLine2,
      city: input.recipient.city,
      state_code: input.recipient.stateCode,
      country_code: input.recipient.countryCode,
      zip: input.recipient.postalCode,
      phone: input.recipient.phone,
      email: input.recipient.email,
    },
    items: input.items.map((item, index) => ({
      external_id: `${input.externalId}-${index + 1}`,
      sync_variant_id: item.providerVariantId,
      external_variant_id: item.providerExternalVariantId,
      quantity: item.quantity,
      name: item.name,
      retail_price: (item.amountCents / 100).toFixed(2),
    })),
  };
  const created = await printfulRequest(
    "/orders?confirm=1",
    { method: "POST", body: JSON.stringify(body) },
    options,
  );
  const providerOrderId = created?.result?.id;
  if (providerOrderId == null) {
    throw new Error("Printful did not return an order ID");
  }
  return {
    providerOrderId: String(providerOrderId),
    status: String(created?.result?.status || "pending"),
  };
}
