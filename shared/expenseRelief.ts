import { z } from "zod";

/**
 * TCE Expense Advantage Program (Consolidated Expense Relief)
 * ------------------------------------------------------------
 * Empire benefit program: membership tiers reimburse a portion of verified
 * out-of-pocket expenses. Companion to Pocket Booster (cushions) — this program
 * pays back after you already spent, subject to vault capital.
 *
 * Funding: Zero-Capital (Subscription + Vault Powered)
 *  - Monthly membership fees seed the Compensation Vault
 *  - Optional $125 Early Activation ($100 + $25 processing) plus tier fee seeds the vault
 *  - Empire Invest RPUs can expand the vault
 *  - No vault capital = no payout
 */

export const EXPENSE_RELIEF_PLATFORM = {
  platformName: "TCE Expense Advantage Program",
  shortName: "TCE Expense Advantage",
  programTag: "EXPENSE_RELIEF_VAULT",
  fundingStrategy: "Zero-Capital (Subscription + Vault Powered)",
  tagline: "Money back in your pocket for real out-of-pocket costs.",
  companionProgram: "Pocket Booster",
} as const;

export const EXPENSE_RELIEF_DISCLAIMER =
  "T. C. E. (The Consolidatus Empire LLC) Expense Advantage Program was created to assist with out-of-pocket expenses that we are often faced with. It is designed with the everyday consumer in mind and we focus on everyday unforeseen incidents that many say \"it won't happen to me\" and most likely don't plan for — things like car accidents, dropped cell phones, traffic violations, and medical visits, etc. Now let's clear up one major misconception: we are not insurance. With us, it is better to have our services and not need it than to need it and not have it.";

/** Shared timing / fee constants across all tiers */
export const EXPENSE_RELIEF_DEFAULTS = {
  firstClaimWaitDays: 30,
  /** $100 early activation + $25 processing — add-on on top of the chosen tier fee */
  earlyActivationFee: 100.0,
  processingFee: 25.0,
  get earlyActivationTotal() {
    return this.earlyActivationFee + this.processingFee;
  },
  reviewHoursMin: 72,
  reviewHoursMax: 168, // 7 days
} as const;

export type ExpenseReliefTierId =
  | "starter"
  | "basic"
  | "premium"
  | "elite";

export type ExpenseReliefTier = {
  id: ExpenseReliefTierId;
  name: string;
  monthlyFee: number;
  reimbursementRate: number;
  monthlyPayoutCap: number;
  annualPayoutCap: number;
  bestFor: string;
};

/**
 * Four membership tiers — reimbursement rises with price.
 * Early Activation ($125) sits outside these tiers.
 */
export const EXPENSE_RELIEF_TIERS: ExpenseReliefTier[] = [
  {
    id: "starter",
    name: "Starter Tier",
    monthlyFee: 10.0,
    reimbursementRate: 0.25,
    monthlyPayoutCap: 100.0,
    annualPayoutCap: 600.0,
    bestFor: "Light expenses, basic coverage",
  },
  {
    id: "basic",
    name: "Basic Tier",
    monthlyFee: 20.0,
    reimbursementRate: 0.4,
    monthlyPayoutCap: 160.0,
    annualPayoutCap: 960.0,
    bestFor: "Moderate daily expenses",
  },
  {
    id: "premium",
    name: "Premium Tier",
    monthlyFee: 40.0,
    reimbursementRate: 0.55,
    monthlyPayoutCap: 220.0,
    annualPayoutCap: 1320.0,
    bestFor: "Higher out-of-pocket costs",
  },
  {
    id: "elite",
    name: "Elite Tier",
    monthlyFee: 60.0,
    reimbursementRate: 0.65,
    monthlyPayoutCap: 260.0,
    annualPayoutCap: 1560.0,
    bestFor: "Maximum reimbursement & frequent expenses",
  },
];

export const EXPENSE_RELIEF_TIER_IDS = EXPENSE_RELIEF_TIERS.map(
  (t) => t.id,
) as unknown as [ExpenseReliefTierId, ...ExpenseReliefTierId[]];

/** @deprecated Prefer EXPENSE_RELIEF_TIERS — kept as Elite defaults for helpers */
export const EXPENSE_RELIEF_PLAN = {
  id: "elite" as const,
  name: "Elite Tier",
  monthlyMembershipFee: 60.0,
  reimbursementRate: 0.65,
  monthlyPayoutCap: 260.0,
  annualPayoutCap: 1560.0,
  firstClaimWaitDays: EXPENSE_RELIEF_DEFAULTS.firstClaimWaitDays,
  accelerationFee: EXPENSE_RELIEF_DEFAULTS.earlyActivationTotal,
  earlyActivationFee: EXPENSE_RELIEF_DEFAULTS.earlyActivationFee,
  processingFee: EXPENSE_RELIEF_DEFAULTS.processingFee,
  reviewHoursMin: EXPENSE_RELIEF_DEFAULTS.reviewHoursMin,
  reviewHoursMax: EXPENSE_RELIEF_DEFAULTS.reviewHoursMax,
  description:
    "Four tiers ($10 / $20 / $40 / $60). Optional $125 Early Activation (+ tier fee) unlocks 72-hour activation instead of 30 days.",
} as const;

export type ExpenseReliefPlan = typeof EXPENSE_RELIEF_PLAN;

export function getTierById(
  id: string | null | undefined,
): ExpenseReliefTier | undefined {
  return EXPENSE_RELIEF_TIERS.find((t) => t.id === id);
}

export function earlyActivationBreakdown(monthlyFee: number) {
  const early = EXPENSE_RELIEF_DEFAULTS.earlyActivationFee;
  const processing = EXPENSE_RELIEF_DEFAULTS.processingFee;
  const addOn = early + processing;
  return {
    monthlyFee,
    earlyActivationFee: early,
    processingFee: processing,
    earlyActivationTotal: addOn,
    /** First-month total if member buys Early Activation with membership */
    firstMonthWithEarlyActivation: monthlyFee + addOn,
  };
}

/** Human-readable first-month totals: $125 Early Activation + each tier fee. */
export function earlyActivationTierExamples(): string {
  const addOn = EXPENSE_RELIEF_DEFAULTS.earlyActivationTotal;
  return EXPENSE_RELIEF_TIERS
    .map((tier) => `$${tier.monthlyFee.toFixed(0)} plan = $${(tier.monthlyFee + addOn).toFixed(0)}`)
    .join(", ");
}

/** Human-readable monthly + annual payout caps for each membership tier. */
export function tierPayoutCapsSummary(): string {
  return EXPENSE_RELIEF_TIERS.map((tier) => {
    const shortName = tier.name.replace(" Tier", "");
    const annual =
      tier.annualPayoutCap >= 1000
        ? `$${tier.annualPayoutCap.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
        : `$${tier.annualPayoutCap.toFixed(0)}`;
    return `${shortName}: $${tier.monthlyPayoutCap.toFixed(0)}/mo cap, ${annual}/yr cap`;
  }).join("; ");
}

export const EXPENSE_RELIEF_MIN_RECEIPT_PHOTOS = 2;
export const EXPENSE_RELIEF_MAX_RECEIPT_PHOTOS = 5;

/** Format a reimbursement rate (0–1) as a whole-number percent label. */
export function formatReimbursementPercent(rate: number): string {
  if (!Number.isFinite(rate) || rate <= 0) return "0%";
  return `${Math.round(rate * 100)}%`;
}

/** Eligible out-of-pocket categories for the claim application dropdown. */
export const EXPENSE_CATEGORIES = [
  {
    id: "auto_deductible",
    label: "Auto Deductible",
    examples: [
      "Auto insurance deductible after a covered claim",
      "Repair or towing costs tied to a verifiable accident claim",
    ],
  },
  {
    id: "traffic_violations",
    label: "Traffic Violations",
    examples: [
      "Paid traffic tickets with agency or court receipt",
      "Administrative court fees tied to traffic violations",
    ],
  },
  {
    id: "toll_way_violations",
    label: "Toll Way Violations",
    examples: [
      "Paid toll bills with agency or statement proof",
      "Toll violation fines with proof of payment",
    ],
  },
  {
    id: "cell_phone_deductible",
    label: "Cell Phone Deductible",
    examples: [
      "Cell phone insurance or carrier deductible",
      "Replacement or repair costs with carrier or repair receipt",
      "Accessories purchased with the phone repair or replacement",
    ],
  },
  {
    id: "medical_copay",
    label: "Medical Co-Pay",
    examples: [
      "Medical office copays with provider receipt",
      "Hospital, urgent care, or clinic copays you paid",
    ],
  },
  {
    id: "dental_copay",
    label: "Dental Co-Pay",
    examples: [
      "Dental office copays with provider receipt",
      "Dental visit out-of-pocket share with invoice proof",
    ],
  },
  {
    id: "vision_copay",
    label: "Vision Co-Pay",
    examples: [
      "Eye exam or vision care copays",
      "Optical visit out-of-pocket share with receipt",
    ],
  },
  {
    id: "investment_program_empire_invest",
    label: "Investment Program-Empire Invest",
    examples: [
      "Qualifying Empire Invest program participation with verifiable documentation",
    ],
  },
] as const;

export type ExpenseCategoryId = (typeof EXPENSE_CATEGORIES)[number]["id"];

/** Build a tier-aware category label (investment program has no %). */
export function categoryLabelWithRate(
  category: (typeof EXPENSE_CATEGORIES)[number],
  rate: number,
): string {
  if (category.id === "investment_program_empire_invest") return category.label;
  return `${formatReimbursementPercent(rate)} ${category.label}`;
}

export function categoriesForTierRate(rate: number) {
  return EXPENSE_CATEGORIES.map((category) => ({
    ...category,
    label: categoryLabelWithRate(category, rate),
  }));
}

/** Prefix acceptable-claim copy with the member's tier reimbursement %. */
export function formatAcceptableClaimItem(item: string, rate: number): string {
  if (item.startsWith("Investment Program")) return item;
  const dash = item.indexOf(" — ");
  if (dash === -1) return `${formatReimbursementPercent(rate)} ${item}`;
  const label = item.slice(0, dash);
  const rest = item.slice(dash);
  return `${formatReimbursementPercent(rate)} ${label}${rest}`;
}

export const EXPENSE_CATEGORY_IDS = EXPENSE_CATEGORIES.map(
  (c) => c.id,
) as unknown as [ExpenseCategoryId, ...ExpenseCategoryId[]];

export const CLAIM_STATUSES = [
  "submitted",
  "under_review",
  "approved",
  "approved_pending_funds",
  "paid",
  "denied",
  "cancelled",
] as const;

export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

const EARLY_ACTIVATION_RULE_BODY = `New memberships wait ${EXPENSE_RELIEF_DEFAULTS.firstClaimWaitDays} days before the first claim can be filed. Skip the wait with Early Activation: $${EXPENSE_RELIEF_DEFAULTS.earlyActivationFee.toFixed(0)} early activation + $${EXPENSE_RELIEF_DEFAULTS.processingFee.toFixed(0)} processing fee = $${EXPENSE_RELIEF_DEFAULTS.earlyActivationTotal.toFixed(0)} one-time, plus your chosen tier's monthly fee (${earlyActivationTierExamples()}). Early Activation activates within ${EXPENSE_RELIEF_DEFAULTS.reviewHoursMin} hours instead of ${EXPENSE_RELIEF_DEFAULTS.firstClaimWaitDays} days. It does not raise your reimbursement % or payout caps — those follow your tier (${tierPayoutCapsSummary()}).`;

export const EXPENSE_RELIEF_RULES = [
  {
    id: "membership",
    title: "Active tier membership required",
    body: "Choose Starter, Basic, Premium, or Elite. Your reimbursement % and payout caps follow that tier. Keep the subscription active to file claims.",
  },
  {
    id: "vault_required",
    title: "No vault money = no payout",
    body: "Approved claims pay only from the Compensation Vault. If the vault has no available capital, you cannot get paid — even with Early Activation. Verified claims can wait as pending-funds until the vault is funded.",
  },
  {
    id: "verification",
    title: "Must be verifiable — not personal lifestyle",
    body: `Claims are reviewed ${EXPENSE_RELIEF_DEFAULTS.reviewHoursMin} hours to about a week. We need a legitimate receipt we can confirm by phone, fax, or merchant lookup — business name, phone, amount, date, and who paid. Personal lifestyle (haircuts, nails, lunch money, kids’ school supplies) is not covered.`,
  },
  {
    id: "caps",
    title: "Tier payout caps protect the pool",
    body: `Each tier has its own monthly and annual payout ceiling. Higher tiers unlock higher reimbursement % and higher caps. Per tier: ${tierPayoutCapsSummary()}.`,
  },
  {
    id: "not_fr2p",
    title: "Not a rewards / affiliate program",
    body: "TCE Expense Advantage reimburses verified expenses. Pocket Booster handles cash cushions. FR2P / FARSUP stay separate for rewards.",
  },
  {
    id: "wait_or_accelerate",
    title: "30-day activation — or $125 Early Activation",
    body: EARLY_ACTIVATION_RULE_BODY,
  },
] as const;

/** Official Activation Policy copy for the website */
export const ACTIVATION_POLICY = {
  title: "TCE Expense Advantage Activation Policy",
  intro:
    "Members must complete a 30-day activation period before filing their first reimbursement claim. This activation period ensures program integrity, prevents fraud, and allows time for verification of member information.",
  requirements: [
    "Membership begins immediately upon purchase.",
    "Claims cannot be filed until 30 days after activation, unless Early Activation is purchased.",
    "Members must maintain an active subscription during the activation period.",
  ],
  earlyActivation: {
    title: "Early Activation Option",
    body: "Members who wish to file a claim before 30 days may choose Early Activation, which requires a one-time fee:",
    lineItems: [
      { label: "Processing Fee", amount: EXPENSE_RELIEF_DEFAULTS.processingFee },
      {
        label: "Early Activation Fee",
        amount: EXPENSE_RELIEF_DEFAULTS.earlyActivationFee,
      },
    ],
    total: EXPENSE_RELIEF_DEFAULTS.earlyActivationTotal,
    notes: [
      "Early Activation is optional.",
      "Early Activation is $125 one-time plus your chosen tier's monthly fee (e.g. $10 + $125 = $135, $20 + $125 = $145, $40 + $125 = $165, $60 + $125 = $185).",
      "Early Activation activates membership for first-claim filing within 72 hours instead of 30 days.",
      "Early Activation does not increase reimbursement percentages or payout caps.",
      `Payout caps follow your tier: ${tierPayoutCapsSummary()}.`,
      "Early Activation applies to all four tiers.",
      "Early Activation unlocks claim eligibility only — payouts still require Compensation Vault capital.",
    ],
  },
} as const;

/** Official Claim Submission Policy copy */
export const CLAIM_SUBMISSION_POLICY = {
  title: "TCE Expense Advantage Claim Submission Policy",
  intro:
    "To maintain fairness and prevent fraudulent activity, all claims must follow the rules below.",
  filingRequirements: [
    "Clear photos of the actual receipt — front and back (upload required). Include the business phone number when it appears on the receipt.",
    "The business name and a reachable phone number so we can verify by call or fax",
    "The business address or location when available",
    "The date of service or purchase",
    "The amount paid out-of-pocket",
    "A brief description for details the receipt may not show (visit time, extra context). Receipt photos are required.",
    "The member’s name on the receipt (or pet’s name for veterinary claims)",
  ],
  verificationWindow: {
    minHours: EXPENSE_RELIEF_DEFAULTS.reviewHoursMin,
    maxHours: EXPENSE_RELIEF_DEFAULTS.reviewHoursMax,
    checks: [
      "Receipt authenticity (not AI-generated, altered, or fabricated)",
      "Business legitimacy — phone call, fax, or merchant lookup when needed",
      "Accuracy of the information provided",
      "That the expense is verifiable and not personal lifestyle spending",
      "That the expense qualifies under the member’s tier and program rules",
    ],
  },
  approvedNotes: [
    "Reimbursement is released according to the member’s tier percentage and payout caps.",
    `Tier caps (monthly / annual): ${tierPayoutCapsSummary()}.`,
    "Payout issues only when the Compensation Vault has available capital.",
    "Members receive confirmation in the app (and email when configured).",
  ],
  deniedReasons: [
    "Receipts are fake, altered, or AI-generated",
    "Information is incomplete or cannot be verified by phone, fax, or merchant records",
    "The expense is personal lifestyle (haircuts, nails, lunch money, children’s school supplies, etc.)",
    "The expense does not qualify under the program",
    "The member’s subscription is inactive",
    "The member attempts to file before activation without Early Activation",
    "The Compensation Vault cannot fund the payout yet (claim may be held pending funds after verification)",
  ],
} as const;

export const ACCEPTABLE_CLAIMS = [
  {
    group: "Auto & transportation (verifiable)",
    items: [
      "Auto Deductible — auto insurance deductible or accident-related out-of-pocket with claim proof",
      "Traffic Violations — paid traffic tickets and court fees with agency receipt",
      "Toll Way Violations — paid toll bills and toll violation fines with statement proof",
    ],
  },
  {
    group: "Cell phone (business & personal bridge)",
    items: [
      "Cell Phone Deductible — carrier or insurance deductible, repair, replacement, and accessories with merchant proof",
    ],
  },
  {
    group: "Healthcare copays (verifiable)",
    items: [
      "Medical Co-Pay — medical office, hospital, urgent care, or clinic copays with provider receipt",
      "Dental Co-Pay — dental office copays and out-of-pocket share with invoice proof",
      "Vision Co-Pay — eye exam or optical visit copays with receipt",
    ],
  },
  {
    group: "Empire Invest",
    items: [
      "Investment Program-Empire Invest — qualifying Empire Invest participation with verifiable documentation",
    ],
  },
] as const;

export const NOT_ACCEPTABLE_CLAIMS = [
  {
    group: "Personal lifestyle (not covered)",
    items: [
      "Haircuts, barbershop, nail salon, spa, or personal grooming",
      "Lunch money, café runs, fast food, snacks, or everyday meals",
      "Entertainment, streaming, hobbies, vacations, luxury goods",
      "Elective cosmetic procedures that are not medically necessary",
      "Work commute, transit, parking, or tolls for personal commuting",
      "Member education, school supplies, or course materials",
      "Household essentials, groceries, utilities, or personal home expenses",
    ],
  },
  {
    group: "Family / kids personal shopping",
    items: [
      "School supplies bought for your children (personal family expense)",
      "Kids’ lunch money, allowances, or personal care for household members",
      "Personal shopping that cannot be tied to your own enrolled education or job requirement",
    ],
  },
  {
    group: "Not real or not verifiable",
    items: [
      "Estimates, quotes, or unpaid invoices",
      "Receipts we cannot confirm by phone, fax, or legitimate merchant records",
      "Altered, photoshopped, AI-generated, or incomplete receipts",
      "Expenses someone else paid with no proof you reimbursed them",
      "Duplicate claims for the same receipt",
    ],
  },
  {
    group: "Money transfers & debt",
    items: [
      "Cash advances, payday loans, credit-card payments, or loan principal (use Pocket Booster for bridge cash)",
      "Investments, crypto, gambling losses, money sent to friends/family",
      "Rent or mortgage as a blanket claim",
    ],
  },
  {
    group: "Program fees & premiums",
    items: [
      "Monthly insurance premiums as the claim itself",
      "TCE Expense Advantage membership or $125 Early Activation fees",
      "Pocket Booster, FR2P, or FARSUP program fees",
    ],
  },
] as const;

export function reimbursementForAmount(
  expenseAmount: number,
  rate: number = EXPENSE_RELIEF_PLAN.reimbursementRate,
): number {
  if (!Number.isFinite(expenseAmount) || expenseAmount <= 0) return 0;
  if (!Number.isFinite(rate) || rate <= 0) return 0;
  return Math.round(expenseAmount * rate * 100) / 100;
}

export function daysSince(from: Date | string, to: Date = new Date()): number {
  const start = from instanceof Date ? from : new Date(from);
  if (Number.isNaN(start.getTime())) return 0;
  const ms = to.getTime() - start.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function hoursSince(from: Date | string, to: Date = new Date()): number {
  const start = from instanceof Date ? from : new Date(from);
  if (Number.isNaN(start.getTime())) return 0;
  const ms = to.getTime() - start.getTime();
  return Math.max(0, ms / (1000 * 60 * 60));
}

export type ClaimEligibility = {
  canFile: boolean;
  reason: string;
  waitingDaysRemaining: number;
  accelerationFeeRequired: boolean;
  /** Flat $125 Early Activation total */
  accelerationFee: number;
  earlyActivationFee: number;
  processingFee: number;
  membershipActive: boolean;
};

/**
 * First-claim gate:
 * - Active membership required
 * - Wait 30 days, OR pay $125 Early Activation (+ tier fee) for 72-hour activation
 */
export function evaluateFirstClaimEligibility(input: {
  membershipActive: boolean;
  membershipStartedAt: Date | string | null;
  accelerationPaid: boolean;
  accelerationPaidAt?: Date | string | null;
  hasPriorClaim: boolean;
  now?: Date;
}): ClaimEligibility {
  const earlyActivationFee = EXPENSE_RELIEF_DEFAULTS.earlyActivationFee;
  const processingFee = EXPENSE_RELIEF_DEFAULTS.processingFee;
  const accelerationFee = EXPENSE_RELIEF_DEFAULTS.earlyActivationTotal;
  const now = input.now ?? new Date();

  if (!input.membershipActive) {
    return {
      canFile: false,
      reason: "Activate a membership tier before filing a claim.",
      waitingDaysRemaining: EXPENSE_RELIEF_DEFAULTS.firstClaimWaitDays,
      accelerationFeeRequired: false,
      accelerationFee,
      earlyActivationFee,
      processingFee,
      membershipActive: false,
    };
  }

  if (input.hasPriorClaim) {
    return {
      canFile: true,
      reason:
        "Activation period satisfied — you may submit claims. Payouts still require vault capital after verification.",
      waitingDaysRemaining: 0,
      accelerationFeeRequired: false,
      accelerationFee,
      earlyActivationFee,
      processingFee,
      membershipActive: true,
    };
  }

  if (input.accelerationPaid) {
    const activationStart =
      input.accelerationPaidAt ?? input.membershipStartedAt;
    const hoursElapsed = activationStart ? hoursSince(activationStart, now) : 0;
    const hoursRemaining = Math.max(
      0,
      EXPENSE_RELIEF_DEFAULTS.reviewHoursMin - hoursElapsed,
    );

    if (hoursRemaining > 0) {
      const hoursLabel =
        hoursRemaining < 1
          ? "less than 1 hour"
          : `about ${Math.ceil(hoursRemaining)} hour${Math.ceil(hoursRemaining) === 1 ? "" : "s"}`;
      return {
        canFile: false,
        reason: `Early Activation is processing — first claim opens within ${EXPENSE_RELIEF_DEFAULTS.reviewHoursMin} hours (${hoursLabel} remaining). Payouts still require vault capital after verification.`,
        waitingDaysRemaining: Math.ceil(hoursRemaining / 24),
        accelerationFeeRequired: false,
        accelerationFee,
        earlyActivationFee,
        processingFee,
        membershipActive: true,
      };
    }

    return {
      canFile: true,
      reason:
        "Early Activation complete — you may submit your first claim. Payouts still require vault capital after verification.",
      waitingDaysRemaining: 0,
      accelerationFeeRequired: false,
      accelerationFee,
      earlyActivationFee,
      processingFee,
      membershipActive: true,
    };
  }

  const elapsed = input.membershipStartedAt
    ? daysSince(input.membershipStartedAt, now)
    : 0;
  const remaining = Math.max(
    0,
    EXPENSE_RELIEF_DEFAULTS.firstClaimWaitDays - elapsed,
  );

  if (remaining <= 0) {
    return {
      canFile: true,
      reason: "30-day activation complete — you may submit your first claim.",
      waitingDaysRemaining: 0,
      accelerationFeeRequired: false,
      accelerationFee,
      earlyActivationFee,
      processingFee,
      membershipActive: true,
    };
  }

  return {
    canFile: false,
    reason: `First claim opens in ${remaining} day${remaining === 1 ? "" : "s"}. Prefer not to wait? Pay Early Activation: $${earlyActivationFee.toFixed(0)} + $${processingFee.toFixed(0)} processing = $${accelerationFee.toFixed(0)} one-time, plus your tier fee. Early Activation activates within ${EXPENSE_RELIEF_DEFAULTS.reviewHoursMin} hours instead of ${EXPENSE_RELIEF_DEFAULTS.firstClaimWaitDays} days. Payouts still need vault capital.`,
    waitingDaysRemaining: remaining,
    accelerationFeeRequired: true,
    accelerationFee,
    earlyActivationFee,
    processingFee,
    membershipActive: true,
  };
}

export function applyPayoutCaps(input: {
  requestedPayout: number;
  paidThisMonth: number;
  paidThisYear: number;
  monthlyPayoutCap?: number;
  annualPayoutCap?: number;
}): { allowedPayout: number; capped: boolean; reason?: string } {
  const monthlyCap =
    input.monthlyPayoutCap ?? EXPENSE_RELIEF_PLAN.monthlyPayoutCap;
  const annualCap =
    input.annualPayoutCap ?? EXPENSE_RELIEF_PLAN.annualPayoutCap;
  const monthlyRoom = Math.max(0, monthlyCap - input.paidThisMonth);
  const annualRoom = Math.max(0, annualCap - input.paidThisYear);
  const room = Math.min(monthlyRoom, annualRoom);
  const allowed = Math.min(input.requestedPayout, room);
  if (allowed <= 0) {
    return {
      allowedPayout: 0,
      capped: true,
      reason:
        monthlyRoom <= 0
          ? `Monthly payout cap of $${monthlyCap.toFixed(0)} reached.`
          : `Annual payout cap of $${annualCap.toFixed(0)} reached.`,
    };
  }
  if (allowed < input.requestedPayout) {
    return {
      allowedPayout: Math.round(allowed * 100) / 100,
      capped: true,
      reason: `Payout trimmed to remaining cap room ($${allowed.toFixed(2)}).`,
    };
  }
  return { allowedPayout: allowed, capped: false };
}

export const activateExpenseReliefSchema = z.object({
  planId: z.enum(EXPENSE_RELIEF_TIER_IDS),
});

export const payAccelerationSchema = z.object({
  confirm: z.literal(true),
});

export const submitExpenseClaimSchema = z.object({
  categoryId: z.enum(EXPENSE_CATEGORY_IDS),
  expenseAmount: z
    .number()
    .finite()
    .positive()
    .max(50_000, "Expense amount looks too large for a single claim."),
  merchantName: z.string().trim().min(2).max(200),
  businessPhone: z.string().trim().min(7).max(40).optional(),
  businessAddress: z.string().trim().min(4).max(300).optional(),
  serviceDate: z.string().trim().min(4).max(40),
  recipientName: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .describe("Member or pet name as it appears on the receipt"),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .describe(
      "Optional notes for details the receipt may not show (visit time, context)",
    ),
  evidenceNotes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .describe("Optional verification notes beyond the uploaded receipt photos"),
  receiptPhotoUrls: z
    .array(z.string().trim().min(1))
    .min(
      EXPENSE_RELIEF_MIN_RECEIPT_PHOTOS,
      `Upload at least ${EXPENSE_RELIEF_MIN_RECEIPT_PHOTOS} receipt photos (front and back).`,
    )
    .max(
      EXPENSE_RELIEF_MAX_RECEIPT_PHOTOS,
      `You can upload up to ${EXPENSE_RELIEF_MAX_RECEIPT_PHOTOS} receipt photos.`,
    ),
});

export type SubmitExpenseClaimInput = z.infer<typeof submitExpenseClaimSchema>;

export const reviewExpenseClaimSchema = z.object({
  claimId: z.string().uuid(),
  decision: z.enum(["approved", "denied"]),
  reviewNotes: z.string().trim().max(2000).optional(),
});

export type ReviewExpenseClaimInput = z.infer<typeof reviewExpenseClaimSchema>;

/** Legacy alias — old single-plan history chart */
export const HISTORICAL_UDS_STYLE_TIERS = EXPENSE_RELIEF_TIERS.map((t) => ({
  monthlyFee: t.monthlyFee,
  reimbursementRate: t.reimbursementRate,
  label: t.name.replace(" Tier", ""),
  note: t.bestFor,
}));
