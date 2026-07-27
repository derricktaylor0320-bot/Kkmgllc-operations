import { createHash } from "crypto";
import type {
  FulfillmentProvider,
  Order,
  OrderFulfillment,
  OrderItem,
  ProviderFulfillmentItem,
  ShippingAddress,
} from "@shared/schema";
import { catalogStorage } from "./catalogStorage";
import { storage } from "./storage";
import {
  configuredAmazonSku,
  configuredPrintfulVariant,
  fulfillmentProviderFor,
  type FulfillmentCatalogProduct,
} from "./fulfillmentRouting";
import {
  discoverPrintfulVariant,
  printfulConfigured,
  submitPrintfulFulfillment,
} from "./printfulClient";
import {
  amazonMcfConfigured,
  submitAmazonMcfFulfillment,
} from "./amazonMcfClient";

interface GroupPlan {
  provider: FulfillmentProvider;
  items: ProviderFulfillmentItem[];
  blockedReasons: string[];
}

function deterministicExternalId(
  squareOrderId: string,
  provider: FulfillmentProvider,
): string {
  const digest = createHash("sha256")
    .update(`${provider}:${squareOrderId}`)
    .digest("hex");
  return provider === "printful"
    ? `kk_pf_${digest.slice(0, 26)}`
    : `kk-amz-${digest.slice(0, 32)}`;
}

function selectionsFromLegacyNote(item: OrderItem): OrderItem {
  if (!item.note) return item;
  const selected = { ...item };
  for (const part of item.note.split("|").map((value) => value.trim())) {
    const separator = part.indexOf(":");
    if (separator <= 0) continue;
    const label = part.slice(0, separator).trim().toLowerCase();
    const value = part.slice(separator + 1).trim();
    if (!value) continue;
    if (label === "size" && !selected.selectedSize) selected.selectedSize = value;
    if (label === "color" && !selected.selectedColor) selected.selectedColor = value;
    if (label === "logo" && !selected.selectedLogo) selected.selectedLogo = value;
  }
  return selected;
}

function legacyShippingDetails(order: Order): ShippingAddress | null {
  if (order.shippingDetails) return order.shippingDetails;
  const lines = String(order.shippingAddress || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 3) return null;
  const countryCode = lines.at(-1)?.toUpperCase() || "";
  const cityMatch = lines.at(-2)?.match(/^(.*),\s*([A-Za-z0-9-]+)\s+(.+)$/);
  if (!cityMatch || !/^[A-Z]{2}$/.test(countryCode)) return null;
  return {
    name: order.customerName?.trim() || "Customer",
    addressLine1: lines[0],
    addressLine2: lines.length > 3 ? lines.slice(1, -2).join(", ") : undefined,
    city: cityMatch[1].trim(),
    stateCode: cityMatch[2].trim(),
    postalCode: cityMatch[3].trim(),
    countryCode,
    email: order.customerEmail || undefined,
  };
}

async function catalogProductFor(
  item: OrderItem,
): Promise<FulfillmentCatalogProduct | null> {
  const row: any = item.catalogPriceId
    ? await catalogStorage.getPriceWithProduct(item.catalogPriceId)
    : await catalogStorage.getProductWithPriceByName(item.name);
  if (!row) return null;
  return {
    name: String(row.product_name || item.name),
    catalogPriceId: String(row.price_id || item.catalogPriceId || "") || undefined,
    metadata:
      row.product_metadata && typeof row.product_metadata === "object"
        ? row.product_metadata
        : {},
  };
}

async function planGroups(order: Order): Promise<GroupPlan[]> {
  const groups = new Map<FulfillmentProvider, GroupPlan>();
  const printfulDiscovery = new Map<string, Awaited<ReturnType<typeof discoverPrintfulVariant>>>();

  for (const [orderItemIndex, rawItem] of order.items.entries()) {
    const item = selectionsFromLegacyNote(rawItem);
    const product = await catalogProductFor(item);
    if (!product) continue;
    const provider = fulfillmentProviderFor(product);
    if (!provider) continue;

    const group =
      groups.get(provider) ||
      { provider, items: [], blockedReasons: [] };
    groups.set(provider, group);
    const planned: ProviderFulfillmentItem = {
      orderItemIndex,
      name: item.name,
      quantity: item.quantity,
      amountCents: item.amountCents,
      catalogPriceId: product.catalogPriceId,
      selectedLogo: item.selectedLogo,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    };

    try {
      if (provider === "printful") {
        if (!printfulConfigured()) {
          group.blockedReasons.push("PRINTFUL_API_TOKEN is not configured");
        } else {
          let variant = configuredPrintfulVariant(
            process.env.PRINTFUL_VARIANT_MAP,
            product,
            item,
          );
          if (!variant) {
            const cacheKey = JSON.stringify([
              product.catalogPriceId,
              product.name,
              item.selectedSize,
              item.selectedColor,
            ]);
            if (!printfulDiscovery.has(cacheKey)) {
              printfulDiscovery.set(
                cacheKey,
                await discoverPrintfulVariant({
                  name: product.name,
                  catalogPriceId: product.catalogPriceId,
                  selectedSize: item.selectedSize,
                  selectedColor: item.selectedColor,
                }),
              );
            }
            variant = printfulDiscovery.get(cacheKey) || null;
          }
          if (variant?.syncVariantId) {
            planned.providerVariantId = variant.syncVariantId;
          } else if (variant?.externalVariantId) {
            planned.providerExternalVariantId = variant.externalVariantId;
          } else {
            group.blockedReasons.push(
              `No unambiguous Printful variant for "${item.name}" (${item.selectedColor || "default color"}, ${item.selectedSize || "default size"})`,
            );
          }
        }
      } else {
        if (!amazonMcfConfigured()) {
          group.blockedReasons.push(
            "Amazon MCF Login-with-Amazon credentials are not configured",
          );
        }
        const sellerSku = configuredAmazonSku(
          process.env.AMAZON_SELLER_SKU_MAP,
          product,
          item,
        );
        if (sellerSku) {
          planned.sellerSku = sellerSku;
        } else {
          group.blockedReasons.push(
            `No Amazon seller SKU mapping for "${item.name}" (${item.selectedColor || "default color"}, ${item.selectedSize || "default size"})`,
          );
        }
      }
    } catch (error: any) {
      group.blockedReasons.push(error?.message || String(error));
    }
    group.items.push(planned);
  }
  return [...groups.values()];
}

function uniqueReasons(reasons: string[]): string | undefined {
  const unique = [...new Set(reasons.filter(Boolean))];
  return unique.length ? unique.join("; ") : undefined;
}

export async function submitOrderFulfillment(
  orderOrId: Order | string,
): Promise<OrderFulfillment[]> {
  const order =
    typeof orderOrId === "string"
      ? await storage.getOrderById(orderOrId)
      : orderOrId;
  if (!order || order.status !== "paid" || !order.squareOrderId) return [];

  const address = legacyShippingDetails(order);
  const groups = await planGroups(order);
  for (const group of groups) {
    const blockedReasons = [...group.blockedReasons];
    if (!address) {
      blockedReasons.push("A complete structured shipping address is required");
    }
    const externalId = deterministicExternalId(
      order.squareOrderId,
      group.provider,
    );
    const job = await storage.saveOrderFulfillmentPlan({
      orderId: order.id,
      provider: group.provider,
      externalId,
      items: group.items,
      blockedReason: uniqueReasons(blockedReasons),
    });
    if (job.status === "blocked" || job.status === "submitted") continue;

    const claimed = await storage.claimOrderFulfillment(job.id);
    if (!claimed || !address) continue;
    try {
      const result =
        group.provider === "printful"
          ? await submitPrintfulFulfillment({
              externalId,
              recipient: address,
              items: group.items,
            })
          : await submitAmazonMcfFulfillment({
              externalId,
              recipient: address,
              items: group.items,
            });
      await storage.completeOrderFulfillment(
        claimed.id,
        result.providerOrderId,
      );
      console.log(
        `[fulfillment] Submitted ${group.provider} order ${result.providerOrderId} for ${order.squareOrderId}`,
      );
    } catch (error: any) {
      const message = error?.message || String(error);
      await storage.failOrderFulfillment(claimed.id, message);
      console.error(
        `[fulfillment] ${group.provider} submission failed for ${order.squareOrderId}: ${message}`,
      );
    }
  }
  return storage.getOrderFulfillments(order.id);
}

export function fulfillmentConfigurationStatus() {
  let printfulMapValid = true;
  let amazonMapValid = true;
  try {
    configuredPrintfulVariant(
      process.env.PRINTFUL_VARIANT_MAP,
      { name: "__probe__", metadata: {} },
      { name: "__probe__", quantity: 1, amountCents: 0 },
    );
  } catch {
    printfulMapValid = false;
  }
  try {
    configuredAmazonSku(
      process.env.AMAZON_SELLER_SKU_MAP,
      { name: "__probe__", metadata: {} },
      { name: "__probe__", quantity: 1, amountCents: 0 },
    );
  } catch {
    amazonMapValid = false;
  }
  return {
    printful: {
      configured: printfulConfigured(),
      storeIdConfigured: Boolean(process.env.PRINTFUL_STORE_ID),
      variantMapConfigured: Boolean(process.env.PRINTFUL_VARIANT_MAP),
      variantMapValid: printfulMapValid,
    },
    amazon: {
      configured: amazonMcfConfigured(),
      sellerSkuMapConfigured: Boolean(process.env.AMAZON_SELLER_SKU_MAP),
      sellerSkuMapValid: amazonMapValid,
      marketplaceId:
        process.env.AMAZON_MARKETPLACE_ID || "ATVPDKIKX0DER",
    },
  };
}
