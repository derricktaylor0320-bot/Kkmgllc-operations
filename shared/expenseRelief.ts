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
 *  - Optional $125 Early Activation ($100 + $25 processing) seeds the vault
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
  /** $100 early activation + $25 processing — flat, outside tier pricing */
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
    "Four tiers ($10 / $20 / $40 / $60). Optional $125 Early Activation unlocks filing before 30 days.",
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

/** Eligible out-of-pocket categories for the claim application dropdown. */
export const EXPENSE_CATEGORIES = [
  {
    id: "auto_deductible",
    label: "65% Auto Deductible",
    examples: [
      "Auto insurance deductible after a covered claim",
      "Repair or towing costs tied to a verifiable accident claim",
    ],
  },
  {
    id: "traffic_violations",
    label: "65% Traffic Violations",
    examples: [
      "Paid traffic tickets with agency or court receipt",
      "Administrative court fees tied to traffic violations",
    ],
  },
  {
    id: "toll_way_violations",
    label: "65% Toll Way Violations",
    examples: [
      "Paid toll bills with agency or statement proof",
      "Toll violation fines with proof of payment",
    ],
  },
  {
    id: "cell_phone_deductible",
    label: "65% Cell Phone Deductible",
    examples: [
      "Cell phone insurance or carrier deductible",
      "Replacement or repair costs with carrier or repair receipt",
      "Accessories purchased with the phone repair or replacement",
    ],
  },
  {
    id: "medical_copay",
    label: "65% Medical Co-Pay",
    examples: [
      "Medical office copays with provider receipt",
      "Hospital, urgent care, or clinic copays you paid",
    ],
  },
  {
    id: "dental_copay",
    label: "65% Dental Co-Pay",
    examples: [
      "Dental office copays with provider receipt",
      "Dental visit out-of-pocket share with invoice proof",
    ],
  },
  {
    id: "vision_copay",
    label: "65% Vision Co-Pay",
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

export const EXPENSE_RELIEF_RULES = [
  {
    id: "membership",
    title: "Active tier membership required",
    body: "Choose Starter, Basic, Premium, or Elite. Your reimbursement % and payout caps follow that tier. Keep the subscription active to file claims.",
  },
  {
    id: "wait_or_accelerate",
    title: "30-day activation — or $125 Early Activation",
    body: `New memberships wait ${EXPENSE_RELIEF_DEFAULTS.firstClaimWaitDays} days before the first claim. Skip the wait with Early Activation: $${EXPENSE_RELIEF_DEFAULTS.earlyActivationFee.toFixed(0)} early activation + $${EXPENSE_RELIEF_DEFAULTS.processingFee.toFixed(0)} processing = $${EXPENSE_RELIEF_DEFAULTS.earlyActivationTotal.toFixed(0)} one-time (any tier). Early Activation does not raise your reimbursement %.`,
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
    body: "Each tier has its own monthly and annual payout ceiling. Higher tiers unlock higher reimbursement % and higher caps.",
  },
  {
    id: "not_fr2p",
    title: "Not a rewards / affiliate program",
    body: "TCE Expense Advantage reimburses verified expenses. Pocket Booster handles cash cushions. FR2P / FARSUP stay separate for rewards.",
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
      "Early Activation does not increase reimbursement percentages.",
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
    "A clear photo or scan of a legitimate receipt (or detailed verification notes while upload rolls out)",
    "The business name and a reachable phone number so we can verify by call or fax",
    "The business address or location when available",
    "The date of service or purchase",
    "The amount paid out-of-pocket",
    "A brief description of the expense and why it qualifies under the selected category",
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
    "Reimbursement is released according to the member’s tier percentage (and caps).",
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
      "65% Auto Deductible — auto insurance deductible or accident-related out-of-pocket with claim proof",
      "65% Traffic Violations — paid traffic tickets and court fees with agency receipt",
      "65% Toll Way Violations — paid toll bills and toll violation fines with statement proof",
    ],
  },
  {
    group: "Cell phone (business & personal bridge)",
    items: [
      "65% Cell Phone Deductible — carrier or insurance deductible, repair, replacement, and accessories with merchant proof",
    ],
  },
  {
    group: "Healthcare copays (verifiable)",
    items: [
      "65% Medical Co-Pay — medical office, hospital, urgent care, or clinic copays with provider receipt",
      "65% Dental Co-Pay — dental office copays and out-of-pocket share with invoice proof",
      "65% Vision Co-Pay — eye exam or optical visit copays with receipt",
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
 * - Wait 30 days, OR pay flat $125 Early Activation
 */
export function evaluateFirstClaimEligibility(input: {
  membershipActive: boolean;
  membershipStartedAt: Date | string | null;
  accelerationPaid: boolean;
  hasPriorClaim: boolean;
  now?: Date;
}): ClaimEligibility {
  const earlyActivationFee = EXPENSE_RELIEF_DEFAULTS.earlyActivationFee;
  const processingFee = EXPENSE_RELIEF_DEFAULTS.processingFee;
  const accelerationFee = EXPENSE_RELIEF_DEFAULTS.earlyActivationTotal;

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

  if (input.hasPriorClaim || input.accelerationPaid) {
    return {
      canFile: true,
      reason: input.accelerationPaid
        ? "Early Activation on file — you may submit claims. Payouts still require vault capital after verification."
        : "Activation period satisfied — you may submit claims. Payouts still require vault capital after verification.",
      waitingDaysRemaining: 0,
      accelerationFeeRequired: false,
      accelerationFee,
      earlyActivationFee,
      processingFee,
      membershipActive: true,
    };
  }

  const elapsed = input.membershipStartedAt
    ? daysSince(input.membershipStartedAt, input.now ?? new Date())
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
    reason: `First claim opens in ${remaining} day${remaining === 1 ? "" : "s"}. Prefer not to wait? Pay Early Activation: $${earlyActivationFee.toFixed(0)} + $${processingFee.toFixed(0)} processing = $${accelerationFee.toFixed(0)} one-time (any tier). That fee unlocks filing only — payouts still need vault capital.`,
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
  description: z.string().trim().min(8).max(2000),
  evidenceNotes: z
    .string()
    .trim()
    .min(8)
    .max(2000)
    .describe("Where the receipt/invoice came from and how to verify it"),
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
