import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FUEL_PERKS_TIERS,
  formatFuelPerksTierLabel,
  getFuelPerksTierById,
} from "./fuelPerks.ts";

describe("fuelPerks tiers", () => {
  it("exposes four budget-aligned membership tiers", () => {
    assert.equal(FUEL_PERKS_TIERS.length, 4);
    assert.deepEqual(
      FUEL_PERKS_TIERS.map((t) => t.monthlyFee),
      [10, 20, 40, 60],
    );
  });

  it("increases cents-per-gallon savings with tier price", () => {
    const rates = FUEL_PERKS_TIERS.map((t) => t.centsPerGallon);
    assert.deepEqual(rates, [3, 5, 8, 12]);
    for (let i = 1; i < rates.length; i++) {
      assert.ok(rates[i] > rates[i - 1]);
    }
  });

  it("resolves tiers by id and formats labels", () => {
    const basic = getFuelPerksTierById("basic");
    assert.ok(basic);
    assert.equal(formatFuelPerksTierLabel(basic!), "Road Basic ($20/mo)");
    assert.equal(getFuelPerksTierById("unknown")?.id, undefined);
  });
});
