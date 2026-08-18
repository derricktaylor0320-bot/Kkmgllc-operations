import assert from "node:assert/strict";
import test from "node:test";
import {
  CUTTING_BOARD_PAIR_PRICE_CENTS,
  CUTTING_BOARD_UNIT_PRICE_CENTS,
  cuttingBoardCustomizeHref,
  cuttingBoardTotalCents,
  NFL_CUTTING_BOARD_GARMENT_ID,
} from "./footballCuttingBoard";

test("cutting board customize href pre-selects garment", () => {
  assert.equal(
    cuttingBoardCustomizeHref("401"),
    `/customize/401?garment=${NFL_CUTTING_BOARD_GARMENT_ID}`,
  );
});

test("cutting board pricing: $50 single, 2 for $90", () => {
  assert.equal(cuttingBoardTotalCents(1), CUTTING_BOARD_UNIT_PRICE_CENTS);
  assert.equal(cuttingBoardTotalCents(2), CUTTING_BOARD_PAIR_PRICE_CENTS);
  assert.equal(
    cuttingBoardTotalCents(3),
    CUTTING_BOARD_PAIR_PRICE_CENTS + CUTTING_BOARD_UNIT_PRICE_CENTS,
  );
  assert.equal(cuttingBoardTotalCents(4), CUTTING_BOARD_PAIR_PRICE_CENTS * 2);
});
