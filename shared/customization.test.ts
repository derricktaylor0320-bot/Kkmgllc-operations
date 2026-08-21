import assert from "node:assert/strict";
import test from "node:test";
import {
  MULTIPLE_PLACEMENT_SURCHARGE_CENTS,
  checkCustomization,
  customizationErrorMessage,
  placementSurchargeCents,
  placementSurchargeDollars,
} from "./customization";
import { encodeElementsDuoSelection } from "./elementsDuo";

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

const DUO_META = {
  customize: "none",
  scented: "true",
  scentOptions:
    "Forbidden Taste, Too Tempting, Pure Havoc, Midnight Habit, Sinfull Seduction, Dark Chemistry, Uncensored, Wicked Touch, Raw Attraction, After Dark, Lethal Charm, Sweet Addiction, Velvet Desire, Guilty Pleasure, Dangerous Craving, Delicious Lava, Delicious Vulva",
  elementsDuo: "true",
  productType: "elements",
};

test("Elements Duo requires a wash and a body butter scent", () => {
  const missing = checkCustomization(DUO_META, undefined, undefined, undefined, "Elements Duo");
  assert.equal(missing.ok, false);
  assert.equal(missing.kind, "duo");

  const washOnly = checkCustomization(
    DUO_META,
    undefined,
    undefined,
    undefined,
    "Elements Duo",
    "Island Tranquility",
  );
  assert.equal(washOnly.ok, false);
  assert.equal(washOnly.kind, "duo");

  const ok = checkCustomization(
    DUO_META,
    undefined,
    undefined,
    undefined,
    "Elements Duo",
    encodeElementsDuoSelection("Island Tranquility", "Forbidden Taste"),
  );
  assert.equal(ok.ok, true);
  assert.equal(ok.kind, "duo");
  assert.equal(
    ok.note,
    "3-in-1 wash: Island Tranquility | Body butter: Forbidden Taste",
  );
});

test("Elements Duo rejects an unknown wash or butter scent", () => {
  const badWash = checkCustomization(
    DUO_META,
    undefined,
    undefined,
    undefined,
    "Elements Duo",
    encodeElementsDuoSelection("Fake Wash", "Forbidden Taste"),
  );
  assert.equal(badWash.ok, false);

  const badButter = checkCustomization(
    DUO_META,
    undefined,
    undefined,
    undefined,
    "Elements Duo",
    encodeElementsDuoSelection("Cocoa Mango", "Not A Scent"),
  );
  assert.equal(badButter.ok, false);
});

test("Elements Duo checkout copy asks for both picks", () => {
  assert.match(
    customizationErrorMessage("duo", "Elements Duo"),
    /3-in-1 body wash and a body butter scent/,
  );
});
