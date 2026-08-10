/** Square / customizer garment id for NFL handmade cutting boards. */
export const NFL_CUTTING_BOARD_GARMENT_ID = "nfl-cutting-board";

export const CUTTING_BOARD_UNIT_PRICE_CENTS = 5000;
export const CUTTING_BOARD_PAIR_PRICE_CENTS = 9000;

export const CUTTING_BOARD_FEATURES = [
  "Handcrafted premium hardwood with detailed NFL team design",
  "Food-safe epoxy resin finish — fully functional or display-ready",
  "Approx. 12.5″ × 11″ (32 × 28 cm), 1″ – 1.4″ thick",
  "Each board is one of a kind — natural wood grain varies",
  "Hand wash only; food-grade mineral oil keeps the wood looking its best",
] as const;

/** Total in cents: $50 per board, or $90 for every pair (2 for $90). */
export function cuttingBoardTotalCents(quantity: unknown): number {
  const qty = Math.max(1, Math.min(99, Math.round(Number(quantity) || 1)));
  const pairs = Math.floor(qty / 2);
  const singles = qty % 2;
  return (
    pairs * CUTTING_BOARD_PAIR_PRICE_CENTS + singles * CUTTING_BOARD_UNIT_PRICE_CENTS
  );
}

export function cuttingBoardTotalDollars(quantity: unknown): number {
  return cuttingBoardTotalCents(quantity) / 100;
}
