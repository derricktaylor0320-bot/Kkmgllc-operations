import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  DEODORANT_PAIR_PRICE_CENTS,
  DEODORANT_TRIPLE_PRICE_CENTS,
  DEODORANT_UNIT_PRICE_CENTS,
  deodorantPricingLabel,
  deodorantTotalCents,
  isElementsDeodorantProduct,
} from "./elementsDeodorant";

describe("elementsDeodorant pricing", () => {
  test("single, pair, and triple tiers", () => {
    assert.equal(deodorantTotalCents(1), DEODORANT_UNIT_PRICE_CENTS);
    assert.equal(deodorantTotalCents(2), DEODORANT_PAIR_PRICE_CENTS);
    assert.equal(deodorantTotalCents(3), DEODORANT_TRIPLE_PRICE_CENTS);
  });

  test("larger quantities use the best pack mix", () => {
    assert.equal(deodorantTotalCents(4), 4200);
    assert.equal(deodorantTotalCents(5), 5200);
    assert.equal(deodorantTotalCents(6), 6000);
    assert.equal(deodorantTotalCents(7), 7200);
  });

  test("pricing label and product detection", () => {
    assert.match(deodorantPricingLabel(), /\$12/);
    assert.equal(
      isElementsDeodorantProduct("price_kkelemsdeodorantlavender"),
      true,
    );
    assert.equal(isElementsDeodorantProduct(undefined, "Lavender Deodorant"), true);
    assert.equal(isElementsDeodorantProduct(undefined, "BCAA Complex"), false);
  });
});
