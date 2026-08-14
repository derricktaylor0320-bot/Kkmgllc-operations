import assert from "node:assert/strict";
import test from "node:test";
import {
  GAME_DAY_BUNDLE_PRICE_CENTS,
  gameDayBundleCustomizeHref,
  gameDayBundleSavingsDollars,
  NFL_GAME_DAY_BUNDLE_GARMENT_ID,
} from "./footballGameDayBundle";

test("game day bundle customize href pre-selects bundle garment", () => {
  assert.equal(
    gameDayBundleCustomizeHref("401"),
    `/customize/401?garment=${NFL_GAME_DAY_BUNDLE_GARMENT_ID}`,
  );
});

test("game day bundle pricing: $99 flat, saves $11 vs separate", () => {
  assert.equal(GAME_DAY_BUNDLE_PRICE_CENTS, 9900);
  assert.equal(gameDayBundleSavingsDollars(), 11);
});
