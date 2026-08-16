/** Single Elements deodorant stick (2.5 oz). */
export const DEODORANT_UNIT_PRICE_CENTS = 1200;

/** Two sticks of the same scent. */
export const DEODORANT_PAIR_PRICE_CENTS = 2200;

/** Three sticks of the same scent. */
export const DEODORANT_TRIPLE_PRICE_CENTS = 3000;

export const DEODORANT_SANDALWOOD_PRICE_ID = "price_kkelemsdeodorantsandalwood";
export const DEODORANT_LAVENDER_PRICE_ID = "price_kkelemsdeodorantlavender";

export const DEODORANT_PRICE_IDS = [
  DEODORANT_SANDALWOOD_PRICE_ID,
  DEODORANT_LAVENDER_PRICE_ID,
] as const;

export function isElementsDeodorantProduct(
  priceId?: string | null,
  title?: string | null,
): boolean {
  if (priceId && (DEODORANT_PRICE_IDS as readonly string[]).includes(priceId)) {
    return true;
  }
  return typeof title === "string" && /deodorant/i.test(title);
}

/** Total in cents: $12 each, 2 for $22, 3 for $30 (best pack mix per line). */
export function deodorantTotalCents(quantity: unknown): number {
  let qty = Math.max(1, Math.min(99, Math.round(Number(quantity) || 1)));
  let total = 0;

  const triples = Math.floor(qty / 3);
  total += triples * DEODORANT_TRIPLE_PRICE_CENTS;
  qty %= 3;

  const pairs = Math.floor(qty / 2);
  total += pairs * DEODORANT_PAIR_PRICE_CENTS;
  qty %= 2;

  total += qty * DEODORANT_UNIT_PRICE_CENTS;
  return total;
}

export function deodorantTotalDollars(quantity: unknown): number {
  return deodorantTotalCents(quantity) / 100;
}

export function deodorantUnitPriceDollars(): number {
  return DEODORANT_UNIT_PRICE_CENTS / 100;
}

export function deodorantPricingLabel(): string {
  return "$12 each · 2 for $22 · 3 for $30";
}
