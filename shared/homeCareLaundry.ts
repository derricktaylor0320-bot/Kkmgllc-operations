/** TCE Home Care & Laundry Collection — partner + direct-checkout SKUs. */

export const LAUNDRY_SAUCE_REFERRAL_URL =
  "https://laundrysauce.com/?referral_code=NYXBJk2YFbvVnMBly";

export const LAUNDRY_DETERGENT_SHEETS_VARIANT_GROUP = "Laundry Detergent Sheets";
export const LAUNDRY_DETERGENT_SHEETS_IMAGE =
  "/assets/kk_elements_laundry_detergent_sheets.jpg";
export const LAUNDRY_DETERGENT_SHEETS_AMAZON_LINK = "https://a.co/d/0igKXrSW";
export const LAUNDRY_DETERGENT_SHEETS_SCENT_OPTIONS =
  "Fresh Scent, Fragrance Free, Lavender, Peppermint, Spring Scent, Sweet Petals";

export const LAUNDRY_DETERGENT_SHEETS_PACKS = [
  {
    count: 32,
    productId: "prod_kkelemslaundry32",
    priceId: "price_kkelemslaundry32",
    priceCents: 1800,
    costCents: 1279,
    profitMargin: "5.21",
  },
  {
    count: 96,
    productId: "prod_kkelemslaundry96",
    priceId: "price_kkelemslaundry96",
    priceCents: 5000,
    costCents: 3300,
    profitMargin: "17.00",
  },
  {
    count: 192,
    productId: "prod_kkelemslaundry192",
    priceId: "price_kkelemslaundry192",
    priceCents: 7049,
    costCents: 5549,
    profitMargin: "15.00",
  },
] as const;

export type LaundryDetergentSheetsPack = (typeof LAUNDRY_DETERGENT_SHEETS_PACKS)[number];

export const LAUNDRY_DETERGENT_SHEETS_PRODUCT_ID =
  LAUNDRY_DETERGENT_SHEETS_PACKS[0].productId;
export const LAUNDRY_DETERGENT_SHEETS_PRICE_ID =
  LAUNDRY_DETERGENT_SHEETS_PACKS[0].priceId;
export const LAUNDRY_DETERGENT_SHEETS_PRICE_CENTS =
  LAUNDRY_DETERGENT_SHEETS_PACKS[0].priceCents;

export const MACHINE_CLEANER_TABLETS_PRODUCT_ID = "prod_kk_machinecleaner";
export const MACHINE_CLEANER_TABLETS_PRICE_ID = "price_kk_machinecleaner";
export const MACHINE_CLEANER_TABLETS_PRICE_CENTS = 1999;

export const LAUNDRY_SAUCE_STARTING_PRICE_DOLLARS = 37;

export function laundryDetergentSheetsPackLabel(count: number): string {
  return `${count} Count`;
}

export function laundryDetergentSheetsName(count: number): string {
  return `${laundryDetergentSheetsPackLabel(count)} Laundry Detergent Sheets`;
}

export function laundryDetergentSheetsDescription(count: number): string {
  return `The Clean People Laundry Detergent Sheets — ultra-concentrated, plant-derived laundry soap in recyclable paper packaging. Hypoallergenic, vegan, and effective on stains and odors. Works in all washing machines including HE. ${count}-count pack. SELECT YOUR SCENT at checkout. Amazon-fulfilled. Available in 6 scents: Fresh Scent, Fragrance Free, Lavender, Peppermint, Spring Scent, and Sweet Petals.`;
}
