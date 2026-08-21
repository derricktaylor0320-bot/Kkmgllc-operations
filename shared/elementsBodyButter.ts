/** Single whipped body butter jar (4 oz). */
export const BODY_BUTTER_UNIT_PRICE_CENTS = 1500;

/** Three jars — Buy 2, Get 1 50% Off ($36 total, $12/jar, save $9). */
export const BODY_BUTTER_TRIPLE_PRICE_CENTS = 3600;

export const BODY_BUTTER_PRICE_ID = "price_kkbodybutter";

export function isElementsBodyButterProduct(
  priceId?: string | null,
  title?: string | null,
): boolean {
  if (priceId === BODY_BUTTER_PRICE_ID) return true;
  return typeof title === "string" && /whipped body butter/i.test(title);
}

/** Total in cents: $15 each, 3 for $36 (best pack mix per line). */
export function bodyButterTotalCents(quantity: unknown): number {
  let qty = Math.max(1, Math.min(99, Math.round(Number(quantity) || 1)));
  let total = 0;

  const triples = Math.floor(qty / 3);
  total += triples * BODY_BUTTER_TRIPLE_PRICE_CENTS;
  qty %= 3;

  total += qty * BODY_BUTTER_UNIT_PRICE_CENTS;
  return total;
}

export function bodyButterTotalDollars(quantity: unknown): number {
  return bodyButterTotalCents(quantity) / 100;
}

export function bodyButterUnitPriceDollars(): number {
  return BODY_BUTTER_UNIT_PRICE_CENTS / 100;
}

export function bodyButterPricingLabel(): string {
  return "$15 each · 3 for $36";
}

/** Marketing frame for the 3-jar bundle. */
export function bodyButterBundlePitch(): string {
  return "Buy 2, Get 1 50% Off — Save $9 Instantly ($12/jar)";
}
