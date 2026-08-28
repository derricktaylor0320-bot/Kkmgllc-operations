/** TCE Home Care & Laundry Collection — partner + direct-checkout SKUs. */

export const LAUNDRY_SAUCE_REFERRAL_URL =
  "https://laundrysauce.com/?referral_code=NYXBJk2YFbvVnMBly";

export const ECO_LAUNDRY_SHEETS_VARIANT_GROUP = "Eco Laundry Sheets";

/** Clean People 32-load box artwork (correct count label for the starter pack). */
export const ECO_LAUNDRY_SHEETS_32_IMAGE =
  "/assets/kk_eco_laundry_sheets_32_loads.jpg";
/** Existing catalog photo showing the 96-load Clean People box. */
export const ECO_LAUNDRY_SHEETS_96_IMAGE =
  "/assets/kk_elements_laundry_detergent_sheets.jpg";
export const LAUNDRY_SAUCE_PODS_IMAGE = "/assets/kk_laundry_sauce_pods.jpg";
export const MACHINE_CLEANER_TABLETS_IMAGE =
  "/assets/kk_washing_machine_cleaner_tablets.jpg";

export const ECO_LAUNDRY_SHEETS_PACKS = [
  {
    count: 32,
    productId: "prod_kk_ecolaundrysheets",
    priceId: "price_kk_ecolaundrysheets",
    priceCents: 1800,
    imageUrl: ECO_LAUNDRY_SHEETS_32_IMAGE,
  },
  {
    count: 64,
    productId: "prod_kk_ecolaundrysheets64",
    priceId: "price_kk_ecolaundrysheets64",
    priceCents: 3200,
    imageUrl: ECO_LAUNDRY_SHEETS_32_IMAGE,
  },
  {
    count: 96,
    productId: "prod_kk_ecolaundrysheets96",
    priceId: "price_kk_ecolaundrysheets96",
    priceCents: 4500,
    imageUrl: ECO_LAUNDRY_SHEETS_96_IMAGE,
  },
] as const;

export type EcoLaundrySheetsPack = (typeof ECO_LAUNDRY_SHEETS_PACKS)[number];

export const ECO_LAUNDRY_SHEETS_PRODUCT_ID = ECO_LAUNDRY_SHEETS_PACKS[0].productId;
export const ECO_LAUNDRY_SHEETS_PRICE_ID = ECO_LAUNDRY_SHEETS_PACKS[0].priceId;
export const ECO_LAUNDRY_SHEETS_PRICE_CENTS = ECO_LAUNDRY_SHEETS_PACKS[0].priceCents;

export const MACHINE_CLEANER_TABLETS_PRODUCT_ID = "prod_kk_machinecleaner";
export const MACHINE_CLEANER_TABLETS_PRICE_ID = "price_kk_machinecleaner";
export const MACHINE_CLEANER_TABLETS_PRICE_CENTS = 1999;

export const LAUNDRY_SAUCE_STARTING_PRICE_DOLLARS = 37;

export function ecoLaundrySheetsPackLabel(count: number): string {
  return `${count} Count`;
}

export function ecoLaundrySheetsDescription(count: number): string {
  return `Dissolvable, eco-conscious detergent sheets designed for standard and HE washers. Eliminates plastic heavy bottles, fights tough stains, and delivers zero waste. ${count}-count pack. Free shipping included.`;
}

/** Storefront image for an eco laundry sheets pack size. */
export function ecoLaundrySheetsImageUrl(count: number): string {
  if (count === 96) return ECO_LAUNDRY_SHEETS_96_IMAGE;
  return ECO_LAUNDRY_SHEETS_32_IMAGE;
}
