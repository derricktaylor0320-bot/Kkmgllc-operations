import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  LUXURY_SPA_BASKETS,
  SPA_BASKET_LINE_NAME,
  SPA_BASKET_PRICE_CENTS,
  SPA_BASKET_PRICE_ID,
  SPA_BASKET_SCENT_OPTIONS,
  isLuxurySpaBasketProduct,
  spaBasketById,
  spaBasketByScentLabel,
  spaBasketPriceDollars,
  spaBasketScentLabel,
} from "./luxurySpaBaskets";

describe("luxurySpaBaskets", () => {
  it("defines seven Aqua Elegante baskets at $45 retail", () => {
    assert.equal(LUXURY_SPA_BASKETS.length, 7);
    for (const basket of LUXURY_SPA_BASKETS) {
      assert.equal(basket.brand, "Aqua Elegante");
      assert.equal(basket.retailPrice, 45);
      assert.ok(basket.costPrice > 0);
    }
  });

  it("builds checkout scent options including the 14pc jasmine set", () => {
    assert.match(SPA_BASKET_SCENT_OPTIONS, /Jasmine & Lavender/);
    assert.match(SPA_BASKET_SCENT_OPTIONS, /Jasmine \(14pc Set\)/);
    assert.match(SPA_BASKET_SCENT_OPTIONS, /Ocean & Coconut/);
    assert.equal(SPA_BASKET_SCENT_OPTIONS.split(", ").length, 7);
  });

  it("labels the 14pc jasmine set distinctly", () => {
    const jasmine14 = spaBasketById("spa-basket-jasmine-14pc-02");
    assert.ok(jasmine14);
    assert.equal(spaBasketScentLabel(jasmine14!), "Jasmine (14pc Set)");
  });

  it("looks up baskets by scent label and id", () => {
    const label = "Honey & Almond";
    const basket = spaBasketByScentLabel(label);
    assert.ok(basket);
    assert.equal(basket!.id, "spa-basket-honey-almond-05");
    assert.equal(spaBasketById("spa-basket-honey-almond-05")?.name, basket!.name);
  });

  it("recognizes the spa basket product by price id or title", () => {
    assert.equal(isLuxurySpaBasketProduct(SPA_BASKET_PRICE_ID, null), true);
    assert.equal(isLuxurySpaBasketProduct(null, SPA_BASKET_LINE_NAME), true);
    assert.equal(isLuxurySpaBasketProduct(null, "Random Tee"), false);
  });

  it("exposes a flat $45 storefront price", () => {
    assert.equal(SPA_BASKET_PRICE_CENTS, 4500);
    assert.equal(spaBasketPriceDollars(), 45);
  });
});
