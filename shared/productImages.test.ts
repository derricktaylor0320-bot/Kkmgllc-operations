import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BODY_BUTTER_IMAGE,
  BODY_WASH_COCOA_MANGO_IMAGE,
  BODY_WASH_COCOA_SHEA_IMAGE,
  BODY_WASH_ISLAND_TRANQUILITY_IMAGE,
  BEDDING_COMFORTER_IMAGE,
  BEDDING_PILLOWCASE_IMAGE,
  HIS_HERS_WATCH_IMAGE,
  resolveStorefrontImageUrl,
} from "./productImages";

describe("resolveStorefrontImageUrl", () => {
  it("rewrites retired brown comforter path to blue silver artwork", () => {
    assert.equal(
      resolveStorefrontImageUrl("/assets/kk_comforter_set.png"),
      BEDDING_COMFORTER_IMAGE,
    );
  });

  it("keeps canonical blue silver paths", () => {
    assert.equal(
      resolveStorefrontImageUrl(BEDDING_COMFORTER_IMAGE),
      BEDDING_COMFORTER_IMAGE,
    );
  });

  it("infers comforter artwork from title when metadata image is empty", () => {
    assert.equal(
      resolveStorefrontImageUrl(
        "",
        "Khomplete Khemistri Accessories Comforter Set",
      ),
      BEDDING_COMFORTER_IMAGE,
    );
  });

  it("infers body butter artwork from title when metadata image is empty", () => {
    assert.equal(
      resolveStorefrontImageUrl("", "Whipped Body Butters"),
      BODY_BUTTER_IMAGE,
    );
  });

  it("infers pillowcase artwork from title", () => {
    assert.equal(
      resolveStorefrontImageUrl(
        "",
        "Khomplete Khemistri Accessories Pillowcase Set",
      ),
      BEDDING_PILLOWCASE_IMAGE,
    );
  });

  it("rewrites retired gold watch image to silver His & Hers artwork", () => {
    assert.equal(
      resolveStorefrontImageUrl("/assets/kka_gold_watch.jpg"),
      HIS_HERS_WATCH_IMAGE,
    );
  });

  it("infers watch artwork from title when metadata image is empty", () => {
    assert.equal(
      resolveStorefrontImageUrl("", "Khomplete Khemistri His & Hers Watch Set"),
      HIS_HERS_WATCH_IMAGE,
    );
  });

  it("infers Elements Duo artwork from title when metadata image is empty", () => {
    assert.equal(
      resolveStorefrontImageUrl("", "Elements Duo"),
      BODY_WASH_COCOA_SHEA_IMAGE,
    );
  });

  it("infers body wash artwork from title when metadata image is empty", () => {
    assert.equal(
      resolveStorefrontImageUrl("", "Cocoa & Shea Butter"),
      BODY_WASH_COCOA_SHEA_IMAGE,
    );
    assert.equal(
      resolveStorefrontImageUrl("", "Island Tranquility"),
      BODY_WASH_ISLAND_TRANQUILITY_IMAGE,
    );
    assert.equal(
      resolveStorefrontImageUrl("", "Cocoa Mango"),
      BODY_WASH_COCOA_MANGO_IMAGE,
    );
  });
});
