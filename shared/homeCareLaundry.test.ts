import test from "node:test";
import assert from "node:assert/strict";
import {
  ECO_LAUNDRY_SHEETS_PACKS,
  ECO_LAUNDRY_SHEETS_PRICE_CENTS,
  ECO_LAUNDRY_SHEETS_VARIANT_GROUP,
  ecoLaundrySheetsDescription,
  ecoLaundrySheetsPackLabel,
} from "./homeCareLaundry.ts";

test("eco laundry sheets has three pack sizes", () => {
  assert.equal(ECO_LAUNDRY_SHEETS_PACKS.length, 3);
  assert.deepEqual(
    ECO_LAUNDRY_SHEETS_PACKS.map((pack) => pack.count),
    [32, 64, 96],
  );
});

test("32-count eco laundry sheets retail at $18.00", () => {
  const starterPack = ECO_LAUNDRY_SHEETS_PACKS[0];
  assert.equal(starterPack.count, 32);
  assert.equal(starterPack.priceCents, 1800);
  assert.equal(ECO_LAUNDRY_SHEETS_PRICE_CENTS, 1800);
});

test("eco laundry sheets pack helpers include count in copy", () => {
  assert.equal(ecoLaundrySheetsPackLabel(32), "32 Count");
  assert.match(ecoLaundrySheetsDescription(32), /32-count pack/);
  assert.equal(ECO_LAUNDRY_SHEETS_VARIANT_GROUP, "Eco Laundry Sheets");
});
