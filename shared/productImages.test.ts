import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BODY_BUTTER_IMAGE,
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

  it("rewrites retired His & Hers watch image to kka_gold_watch artwork", () => {
    assert.equal(
      resolveStorefrontImageUrl("/assets/kk_his_hers_watch_set.jpg"),
      HIS_HERS_WATCH_IMAGE,
    );
  });

  it("infers watch artwork from title when metadata image is empty", () => {
    assert.equal(
      resolveStorefrontImageUrl("", "Khomplete Khemistri His & Hers Watch Set"),
      HIS_HERS_WATCH_IMAGE,
    );
  });
});
