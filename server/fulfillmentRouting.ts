import type {
  FulfillmentProvider,
  OrderItem,
} from "@shared/schema";
import type { PrintfulVariantReference } from "./printfulClient";

export interface FulfillmentCatalogProduct {
  name: string;
  catalogPriceId?: string;
  metadata: Record<string, unknown>;
}

function normalized(value: string): string {
  return value.trim().toLowerCase();
}

function objectEntry(
  object: Record<string, unknown>,
  key: string,
): unknown {
  const wanted = normalized(key);
  const match = Object.entries(object).find(
    ([candidate]) => normalized(candidate) === wanted,
  );
  return match?.[1];
}

function parseMap(raw: string | undefined): Record<string, unknown> {
  if (!raw?.trim()) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Variant mapping must be valid JSON");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Variant mapping must be a JSON object");
  }
  return parsed as Record<string, unknown>;
}

export function fulfillmentProviderFor(
  product: FulfillmentCatalogProduct,
): FulfillmentProvider | null {
  const category = String(product.metadata.category || "");
  const isPolo = /\bpolos?\b/i.test(category) || /\bpolos?\b/i.test(product.name);
  const isTee =
    /\bt[\s-]?shirts?\b/i.test(category) ||
    /\btees?\b/i.test(category) ||
    /\bt[\s-]?shirts?\b/i.test(product.name) ||
    /\btees?\b/i.test(product.name);
  if (!isPolo && !isTee) return null;

  const explicit = normalized(
    String(
      product.metadata.fulfillmentProvider ||
        product.metadata.fulfillment_provider ||
        "",
    ),
  );
  if (explicit === "printful" || explicit === "amazon") return explicit;
  return isPolo ? "amazon" : "printful";
}

export function selectionKeys(item: OrderItem): string[] {
  const parts = [
    item.selectedLogo ? `logo=${item.selectedLogo}` : "",
    item.selectedColor ? `color=${item.selectedColor}` : "",
    item.selectedSize ? `size=${item.selectedSize}` : "",
  ].filter(Boolean);
  const keys: string[] = [];
  if (parts.length) keys.push(parts.join("|"));
  if (item.selectedColor && item.selectedSize) {
    keys.push(`color=${item.selectedColor}|size=${item.selectedSize}`);
    keys.push(`${item.selectedColor}|${item.selectedSize}`);
  }
  if (item.selectedLogo && item.selectedSize) {
    keys.push(`logo=${item.selectedLogo}|size=${item.selectedSize}`);
  }
  if (item.selectedSize) {
    keys.push(`size=${item.selectedSize}`, item.selectedSize);
  }
  if (item.selectedColor) keys.push(`color=${item.selectedColor}`, item.selectedColor);
  if (item.selectedLogo) keys.push(`logo=${item.selectedLogo}`, item.selectedLogo);
  keys.push("default");
  return [...new Set(keys.map((key) => key.trim()).filter(Boolean))];
}

function productMapping(
  raw: string | undefined,
  product: FulfillmentCatalogProduct,
): unknown {
  const map = parseMap(raw);
  return (
    (product.catalogPriceId
      ? objectEntry(map, product.catalogPriceId)
      : undefined) ?? objectEntry(map, product.name)
  );
}

function selectedMapping(mapping: unknown, item: OrderItem): unknown {
  if (!mapping || typeof mapping !== "object" || Array.isArray(mapping)) {
    return mapping;
  }
  const object = mapping as Record<string, unknown>;
  const isDirect =
    "syncVariantId" in object ||
    "externalVariantId" in object ||
    "sellerSku" in object;
  if (isDirect) return object;
  for (const key of selectionKeys(item)) {
    const value = objectEntry(object, key);
    if (value !== undefined) return value;
  }
  return undefined;
}

export function configuredPrintfulVariant(
  raw: string | undefined,
  product: FulfillmentCatalogProduct,
  item: OrderItem,
): PrintfulVariantReference | null {
  const value = selectedMapping(productMapping(raw, product), item);
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return { syncVariantId: Math.trunc(value) };
  }
  if (typeof value === "string" && value.trim()) {
    return { externalVariantId: value.trim() };
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const object = value as Record<string, unknown>;
    const syncVariantId = Number(object.syncVariantId);
    const externalVariantId =
      typeof object.externalVariantId === "string"
        ? object.externalVariantId.trim()
        : "";
    if (Number.isFinite(syncVariantId) && syncVariantId > 0) {
      return { syncVariantId: Math.trunc(syncVariantId) };
    }
    if (externalVariantId) return { externalVariantId };
  }
  return null;
}

export function configuredAmazonSku(
  raw: string | undefined,
  product: FulfillmentCatalogProduct,
  item: OrderItem,
): string | null {
  const value = selectedMapping(productMapping(raw, product), item);
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const sellerSku = (value as Record<string, unknown>).sellerSku;
    if (typeof sellerSku === "string" && sellerSku.trim()) {
      return sellerSku.trim();
    }
  }
  return null;
}
