import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  BODY_BUTTER_TRIPLE_PRICE_CENTS,
  BODY_BUTTER_UNIT_PRICE_CENTS,
  bodyButterBundlePitch,
  bodyButterPricingLabel,
  bodyButterTotalCents,
  isElementsBodyButterProduct,
} from "./elementsBodyButter";

describe("elementsBodyButter pricing", () => {
  test("single and triple tiers", () => {
    assert.equal(bodyButterTotalCents(1), BODY_BUTTER_UNIT_PRICE_CENTS);
    assert.equal(bodyButterTotalCents(3), BODY_BUTTER_TRIPLE_PRICE_CENTS);
  });

  test("larger quantities use the best pack mix", () => {
    assert.equal(bodyButterTotalCents(4), 5100);
    assert.equal(bodyButterTotalCents(5), 6600);
    assert.equal(bodyButterTotalCents(6), 7200);
    assert.equal(bodyButterTotalCents(7), 8700);
  });

  test("pricing label, bundle pitch, and product detection", () => {
    assert.match(bodyButterPricingLabel(), /\$15/);
    assert.match(bodyButterPricingLabel(), /\$36/);
    assert.match(bodyButterBundlePitch(), /Buy 2, Get 1 50% Off/);
    assert.match(bodyButterBundlePitch(), /Save \$9/);
    assert.equal(
      isElementsBodyButterProduct("price_kkbodybutter"),
      true,
    );
    assert.equal(
      isElementsBodyButterProduct(undefined, "Whipped Body Butters"),
      true,
    );
    assert.equal(isElementsBodyButterProduct(undefined, "BCAA Complex"), false);
  });
});
