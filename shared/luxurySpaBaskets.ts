/** Aqua Elegante luxury spa gift baskets — Amazon-fulfilled gift sets. */

export interface LuxurySpaBasket {
  id: string;
  name: string;
  brand: string;
  scent: readonly string[];
  costPrice: number;
  retailPrice: number;
}

export const LUXURY_SPA_BASKETS: readonly LuxurySpaBasket[] = [
  {
    id: "spa-basket-jasmine-lavender-01",
    name: "Spa Gift Basket For Women - Jasmine & Lavender",
    brand: "Aqua Elegante",
    scent: ["Jasmine", "Lavender"],
    costPrice: 30.95,
    retailPrice: 45.0,
  },
  {
    id: "spa-basket-jasmine-14pc-02",
    name: "Bath and Body Gift Basket For Women & Men - 14pc Spa Set in Jasmine",
    brand: "Aqua Elegante",
    scent: ["Jasmine"],
    costPrice: 38.99,
    retailPrice: 45.0,
  },
  {
    id: "spa-basket-coconut-vanilla-03",
    name: "Luxury Spa Gift Set For Women - Coconut & Vanilla",
    brand: "Aqua Elegante",
    scent: ["Coconut", "Vanilla"],
    costPrice: 33.95,
    retailPrice: 45.0,
  },
  {
    id: "spa-basket-lavender-teatree-04",
    name: "Spa Gift Basket For Women - Lavender & Tea Tree",
    brand: "Aqua Elegante",
    scent: ["Lavender", "Tea Tree"],
    costPrice: 30.95,
    retailPrice: 45.0,
  },
  {
    id: "spa-basket-honey-almond-05",
    name: "Spa Gift Basket For Women - Honey & Almond",
    brand: "Aqua Elegante",
    scent: ["Honey", "Almond"],
    costPrice: 30.95,
    retailPrice: 45.0,
  },
  {
    id: "spa-basket-lavender-chamomile-06",
    name: "Luxury Spa Gift Set For Women - Lavender & Chamomile",
    brand: "Aqua Elegante",
    scent: ["Lavender", "Chamomile"],
    costPrice: 33.95,
    retailPrice: 45.0,
  },
  {
    id: "spa-basket-ocean-coconut-07",
    name: "Luxury Spa Gift Set For Women - Ocean & Coconut",
    brand: "Aqua Elegante",
    scent: ["Ocean", "Coconut"],
    costPrice: 33.95,
    retailPrice: 45.0,
  },
] as const;

export const SPA_BASKET_LINE_NAME = "Aqua Elegante Luxury Spa Gift Basket";
export const SPA_BASKET_PRODUCT_ID = "prod_kkspabasket";
export const SPA_BASKET_PRICE_ID = "price_kkspabasket";
export const SPA_BASKET_PRICE_CENTS = 4500;

/** Checkout scent label — distinguishes the 14pc unisex jasmine set. */
export function spaBasketScentLabel(basket: LuxurySpaBasket): string {
  if (basket.id === "spa-basket-jasmine-14pc-02") {
    return "Jasmine (14pc Set)";
  }
  return basket.scent.join(" & ");
}

export const SPA_BASKET_SCENT_OPTIONS = LUXURY_SPA_BASKETS.map(spaBasketScentLabel).join(
  ", ",
);

export function spaBasketByScentLabel(label: string): LuxurySpaBasket | undefined {
  return LUXURY_SPA_BASKETS.find((basket) => spaBasketScentLabel(basket) === label);
}

export function spaBasketById(id: string): LuxurySpaBasket | undefined {
  return LUXURY_SPA_BASKETS.find((basket) => basket.id === id);
}

export function isLuxurySpaBasketProduct(
  priceId?: string | null,
  title?: string | null,
): boolean {
  if (priceId === SPA_BASKET_PRICE_ID) return true;
  return typeof title === "string" && /luxury spa gift basket|aqua elegante.*spa/i.test(title);
}

export function spaBasketPriceDollars(): number {
  return SPA_BASKET_PRICE_CENTS / 100;
}
