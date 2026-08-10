import assert from "node:assert/strict";
import test from "node:test";
import {
  CUTTING_BOARD_PAIR_PRICE_CENTS,
  CUTTING_BOARD_UNIT_PRICE_CENTS,
  cuttingBoardTotalCents,
} from "./footballCuttingBoard";

test("cutting board pricing: $50 single, 2 for $90", () => {
  assert.equal(cuttingBoardTotalCents(1), CUTTING_BOARD_UNIT_PRICE_CENTS);
  assert.equal(cuttingBoardTotalCents(2), CUTTING_BOARD_PAIR_PRICE_CENTS);
  assert.equal(
    cuttingBoardTotalCents(3),
    CUTTING_BOARD_PAIR_PRICE_CENTS + CUTTING_BOARD_UNIT_PRICE_CENTS,
  );
  assert.equal(cuttingBoardTotalCents(4), CUTTING_BOARD_PAIR_PRICE_CENTS * 2);
});
