/**
 * Canonical storefront image paths for bedding and body butter, plus legacy
 * brown artwork paths retired when the catalog switched to royal blue / silver.
 */
export const BEDDING_COMFORTER_IMAGE = "/assets/kk_bedding_set_blue_silver.jpeg";
export const BEDDING_SHEET_IMAGE = "/assets/kk_bedding_set_blue_silver.jpeg";
export const BEDDING_PILLOWCASE_IMAGE = "/assets/kk_pillowcase_set_blue_silver.jpeg";
export const BEDDING_BODY_PILLOW_IMAGE = "/assets/kk_body_pillow_blue_silver.jpeg";
export const BODY_BUTTER_IMAGE = "/assets/whipped_body_butters_branded.png";

/** Retired chocolate-brown bedding paths (still present on some prod snapshots). */
export const LEGACY_BROWN_BEDDING_IMAGE_PATHS: Record<string, string> = {
  "/assets/kk_comforter_set.png": BEDDING_COMFORTER_IMAGE,
  "/assets/kk_sheet_set.png": BEDDING_SHEET_IMAGE,
  "/assets/kk_pillowcase_set.png": BEDDING_PILLOWCASE_IMAGE,
  "/assets/kk_body_pillow.png": BEDDING_BODY_PILLOW_IMAGE,
};

const TITLE_IMAGE_OVERRIDES: Array<{ pattern: RegExp; imageUrl: string }> = [
  { pattern: /comforter set/i, imageUrl: BEDDING_COMFORTER_IMAGE },
  { pattern: /sheet set/i, imageUrl: BEDDING_SHEET_IMAGE },
  { pattern: /pillowcase set/i, imageUrl: BEDDING_PILLOWCASE_IMAGE },
  { pattern: /body pillow/i, imageUrl: BEDDING_BODY_PILLOW_IMAGE },
  { pattern: /whipped body butter/i, imageUrl: BODY_BUTTER_IMAGE },
];

function isBlueSilverArtwork(path: string): boolean {
  return (
    path.includes("_blue_silver") ||
    path.includes("whipped_body_butters_branded")
  );
}

/**
 * Resolve the image URL the storefront should display. Rewrites retired brown
 * bedding paths and fills in canonical blue artwork when metadata is missing
 * but the product title is a known bedding / body butter SKU.
 */
export function resolveStorefrontImageUrl(
  imageUrl: string | null | undefined,
  productTitle?: string | null,
): string {
  const trimmed = (imageUrl || "").trim();
  if (trimmed) {
    const legacy = LEGACY_BROWN_BEDDING_IMAGE_PATHS[trimmed];
    if (legacy) return legacy;
    if (isBlueSilverArtwork(trimmed)) return trimmed;
  }

  const title = (productTitle || "").trim();
  if (title) {
    for (const { pattern, imageUrl: override } of TITLE_IMAGE_OVERRIDES) {
      if (pattern.test(title)) return override;
    }
  }

  return trimmed;
}
