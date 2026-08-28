import test from "node:test";
import assert from "node:assert/strict";
import {
  LAUNDRY_DETERGENT_SHEETS_PACKS,
  LAUNDRY_DETERGENT_SHEETS_PRICE_CENTS,
  LAUNDRY_DETERGENT_SHEETS_VARIANT_GROUP,
  laundryDetergentSheetsDescription,
  laundryDetergentSheetsName,
  laundryDetergentSheetsPackLabel,
} from "./homeCareLaundry.ts";

test("laundry detergent sheets has three pack sizes (32, 96, 192)", () => {
  assert.equal(LAUNDRY_DETERGENT_SHEETS_PACKS.length, 3);
  assert.deepEqual(
    LAUNDRY_DETERGENT_SHEETS_PACKS.map((pack) => pack.count),
    [32, 96, 192],
  );
});

test("32-count laundry detergent sheets retail at $18.00", () => {
  const starterPack = LAUNDRY_DETERGENT_SHEETS_PACKS[0];
  assert.equal(starterPack.count, 32);
  assert.equal(starterPack.priceCents, 1800);
  assert.equal(LAUNDRY_DETERGENT_SHEETS_PRICE_CENTS, 1800);
});

test("laundry detergent sheets pack helpers include count in copy", () => {
  assert.equal(laundryDetergentSheetsPackLabel(32), "32 Count");
  assert.equal(
    laundryDetergentSheetsName(32),
    "32 Count Laundry Detergent Sheets",
  );
  assert.match(laundryDetergentSheetsDescription(32), /32-count pack/);
  assert.equal(LAUNDRY_DETERGENT_SHEETS_VARIANT_GROUP, "Laundry Detergent Sheets");
});
