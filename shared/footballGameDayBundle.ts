/** Square / customizer garment id for the team floor mat + cutting board bundle. */
export const NFL_GAME_DAY_BUNDLE_GARMENT_ID = "nfl-game-day-bundle";

export const FLOOR_MAT_UNIT_PRICE_CENTS = 6000;
export const GAME_DAY_BUNDLE_PRICE_CENTS = 9900;

export const GAME_DAY_BUNDLE_FEATURES = [
  "Custom team-logo car floor mats (rug-style, all-weather)",
  "Handmade NFL cutting board with your team crest in colored resin",
  "One flat $99 price — save $11 vs buying separately ($60 mat + $50 board)",
  "Logo and shipping included on the floor mats",
] as const;

export function gameDayBundlePriceDollars(): number {
  return GAME_DAY_BUNDLE_PRICE_CENTS / 100;
}

export function gameDayBundleSavingsDollars(): number {
  return (
    (FLOOR_MAT_UNIT_PRICE_CENTS + 5000 - GAME_DAY_BUNDLE_PRICE_CENTS) / 100
  );
}

import { CUTTING_BOARD_GARMENT_QUERY_PARAM } from "./footballCuttingBoard";

export function gameDayBundleCustomizeHref(teamLogoId: string): string {
  return `/customize/${teamLogoId}?${CUTTING_BOARD_GARMENT_QUERY_PARAM}=${NFL_GAME_DAY_BUNDLE_GARMENT_ID}`;
}
