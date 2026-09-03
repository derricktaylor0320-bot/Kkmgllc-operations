/**
 * FR2P Fuel Rewards — membership tiers aligned with TCE Expense Advantage
 * pricing ($10 / $20 / $40 / $60) so every budget can join the fuel pool.
 */
export type FuelPerksTierId = "starter" | "basic" | "premium" | "elite";

export type FuelPerksTier = {
  id: FuelPerksTierId;
  name: string;
  monthlyFee: number;
  centsPerGallon: number;
  bestFor: string;
  perks: string[];
};

export const FUEL_PERKS_PLATFORM = {
  platformName: "FR2P Fuel Rewards",
  shortName: "Fuel Rewards",
  tagline: "Community-backed fuel savings for every budget.",
} as const;

export const FUEL_PERKS_TIERS: FuelPerksTier[] = [
  {
    id: "starter",
    name: "Commuter Starter",
    monthlyFee: 10,
    centsPerGallon: 3,
    bestFor: "Light drivers on a tight budget",
    perks: ["Member QR code", "Referral link", "Community fuel pool access"],
  },
  {
    id: "basic",
    name: "Road Basic",
    monthlyFee: 20,
    centsPerGallon: 5,
    bestFor: "Daily commuters",
    perks: ["5¢/gal savings", "Member QR code", "Referral tracking"],
  },
  {
    id: "premium",
    name: "Fleet Premium",
    monthlyFee: 40,
    centsPerGallon: 8,
    bestFor: "High-mileage households",
    perks: ["8¢/gal savings", "Priority partner network", "Team referral tracking"],
  },
  {
    id: "elite",
    name: "Empire Elite",
    monthlyFee: 60,
    centsPerGallon: 12,
    bestFor: "Maximum savings & affiliate growth",
    perks: [
      "12¢/gal savings",
      "Magnet & asset kit",
      "FR2P cross-promo boosts",
      "Affiliate downline tools",
    ],
  },
];

export const FUEL_PERKS_TIER_IDS = FUEL_PERKS_TIERS.map(
  (t) => t.id,
) as unknown as [FuelPerksTierId, ...FuelPerksTierId[]];

export function getFuelPerksTierById(
  id: string | undefined,
): FuelPerksTier | undefined {
  return FUEL_PERKS_TIERS.find((t) => t.id === id);
}

export function formatFuelPerksTierLabel(tier: FuelPerksTier): string {
  return `${tier.name} ($${tier.monthlyFee.toFixed(0)}/mo)`;
}
