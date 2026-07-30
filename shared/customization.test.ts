import assert from "node:assert/strict";
import test from "node:test";
import {
  MULTIPLE_PLACEMENT_SURCHARGE_CENTS,
  placementSurchargeCents,
  placementSurchargeDollars,
} from "./customization";

test("one print location is included in the garment price", () => {
  assert.equal(placementSurchargeCents(0), 0);
  assert.equal(placementSurchargeCents(1), 0);
  assert.equal(placementSurchargeDollars(1), 0);
});

test("multiple print locations add one flat $3 fee", () => {
  assert.equal(MULTIPLE_PLACEMENT_SURCHARGE_CENTS, 300);
  assert.equal(placementSurchargeCents(2), 300);
  assert.equal(placementSurchargeCents(6), 300);
  assert.equal(placementSurchargeDollars(2), 3);
});

test("invalid placement counts never add a fee", () => {
  assert.equal(placementSurchargeCents(undefined), 0);
  assert.equal(placementSurchargeCents("2"), 0);
  assert.equal(placementSurchargeCents(Number.NaN), 0);
});
