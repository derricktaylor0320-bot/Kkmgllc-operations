import { z } from "zod";

/**
 * Consolidated Expense Relief (CER)
 * ----------------------------------
 * Standalone Empire program inspired by the old UDS (Ultimate Discount Services)
 * model — one solid membership that puts a portion of verified out-of-pocket
 * expenses back in members' pockets.
 *
 * This is NOT FR2P / FARSUP rewards. Those stay separate. CER is expense
 * compensation only. Later it can sit beside FR2P inside Empire Invest.
 *
 * Funding strategy: Zero-Capital (Subscription + Vault Powered)
 *  - Monthly membership fees seed the Compensation Vault
 *  - Optional $100 early-claim acceleration fees also seed the vault
 *  - Empire Invest RPUs can expand the vault (same loop as Pocket Booster)
 *  - Founder personal capital is never required
 */

export const EXPENSE_RELIEF_PLATFORM = {
  platformName: "Consolidated Expense Relief",
  shortName: "Expense Relief",
  programTag: "EXPENSE_RELIEF_VAULT",
  fundingStrategy: "Zero-Capital (Subscription + Vault Powered)",
  tagline: "Money back in your pocket for real out-of-pocket costs.",
} as const;

/**
 * Historical UDS-style tiers — kept for education / future reference only.
 * We do NOT offer all four. UDS itself retired 10/20/30 and kept the top plan
 * because that was the one members actually wanted.
 */
export const HISTORICAL_UDS_STYLE_TIERS = [
  {
    monthlyFee: 10,
    reimbursementRate: 0.25,
    label: "Starter",
    note: "Retired — too little benefit for the complexity of four plans.",
  },
  {
    monthlyFee: 20,
    reimbursementRate: 0.35,
    label: "Builder",
    note: "Retired — middle tiers confused buyers.",
  },
  {
    monthlyFee: 30,
    reimbursementRate: 0.5,
    label: "Plus",
    note: "Retired — members still upgraded toward the top plan.",
  },
  {
    monthlyFee: 40,
    reimbursementRate: 0.65,
    label: "Premier",
    note: "The plan that stuck — biggest reimbursement, one clear offer.",
  },
] as const;

/** The one solid plan we actually sell. */
export const EXPENSE_RELIEF_PLAN = {
  id: "premier",
  name: "Premier Expense Relief",
  monthlyMembershipFee: 40.0,
  /** Up to 65% of verified out-of-pocket spend (capped below). */
  reimbursementRate: 0.65,
  /** Hard monthly payout ceiling so the vault stays solvent. */
  monthlyPayoutCap: 260.0,
  /** Hard annual payout ceiling per member. */
  annualPayoutCap: 1560.0,
  /**
   * Days a new member must wait before filing the first claim —
   * unless they pay the acceleration fee.
   */
  firstClaimWaitDays: 30,
  /**
   * One-time fee (on top of membership) to unlock claims inside the
   * waiting window. Goes straight into the Compensation Vault.
   */
  accelerationFee: 100.0,
  /** Typical review window once a claim is submitted. */
  reviewHoursMin: 72,
  /** Outer bound for verification / legitimacy checks. */
  reviewHoursMax: 168, // 7 days
  description:
    "One solid plan — up to 65% back on verified out-of-pocket expenses. No maze of $10 / $20 / $30 / $40 tiers.",
} as const;

export type ExpenseReliefPlan = typeof EXPENSE_RELIEF_PLAN;

/** Eligible out-of-pocket categories (not FR2P rewards — real paid costs). */
export const EXPENSE_CATEGORIES = [
  {
    id: "veterinary",
    label: "Veterinary",
    examples: [
      "Checkups & wellness visits",
      "Vaccinations",
      "Medications",
      "Emergency visits",
      "Diagnostics & surgery",
      "Dental cleaning",
    ],
  },
  {
    id: "dental",
    label: "Dental",
    examples: [
      "Cleanings & exams",
      "Fillings",
      "Crowns & bridges",
      "Root canals",
      "Extractions",
      "Orthodontics",
    ],
  },
  {
    id: "healthcare",
    label: "Healthcare & Medical",
    examples: [
      "Copays",
      "Deductibles",
      "Coinsurance",
      "Prescriptions",
      "OTC meds",
      "Therapy & PT",
      "Vision care",
      "Medical supplies",
    ],
  },
  {
    id: "insurance_oop",
    label: "Insurance Out-of-Pocket",
    examples: [
      "Non-covered services",
      "Out-of-network fees",
      "Prescription tiers",
      "Copays & coinsurance beyond plan coverage",
    ],
  },
  {
    id: "tickets_tolls",
    label: "Tolls, Tickets & Violations",
    examples: [
      "Toll bills",
      "Parking tickets",
      "Traffic violations (paid fines)",
      "Administrative court fees",
    ],
  },
  {
    id: "household",
    label: "Household & Living Essentials",
    examples: [
      "Utilities shortfalls",
      "Essential repairs",
      "Childcare gaps",
      "Pet food & supplies tied to care",
    ],
  },
  {
    id: "work_education",
    label: "Work & Education",
    examples: [
      "Commuting costs",
      "Required work supplies",
      "School supplies",
      "Uniform fees",
    ],
  },
  {
    id: "admin_fees",
    label: "Financial & Administrative Fees",
    examples: [
      "Bank fees",
      "Late fees",
      "Service / processing fees",
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

/**
 * Hard program rules members must understand before joining or filing.
 * The $100 is ONLY an early-claim unlock — it does not guarantee a payout.
 * If the Compensation Vault is empty, nobody gets paid.
 */
export const EXPENSE_RELIEF_RULES = [
  {
    id: "membership",
    title: "Premier membership required",
    body: `Active $${EXPENSE_RELIEF_PLAN.monthlyMembershipFee.toFixed(0)}/mo Premier membership is required to file claims.`,
  },
  {
    id: "wait_or_accelerate",
    title: "30-day wait — or pay $100 to file early",
    body: `New members wait ${EXPENSE_RELIEF_PLAN.firstClaimWaitDays} days before the first claim. Do not want to wait? Pay the $${EXPENSE_RELIEF_PLAN.accelerationFee.toFixed(0)} acceleration fee on top of the membership fee, then you may file inside that window. The $100 is not a payout — it only unlocks early filing and seeds the vault.`,
  },
  {
    id: "vault_required",
    title: "No vault money = no payout",
    body: "Approved claims are paid only from the Compensation Vault. If the vault has no available capital, you cannot get paid — even with an active membership or the $100 acceleration fee. Your claim can still be verified and held until funds are available.",
  },
  {
    id: "verification",
    title: "Verify before pay",
    body: `Every claim is reviewed for legitimacy (${EXPENSE_RELIEF_PLAN.reviewHoursMin} hours typical, up to about a week). Receipts must show a real merchant, your name or your pet's name, service date, and proof you paid.`,
  },
  {
    id: "caps",
    title: "Payout caps protect the pool",
    body: `Up to ${(EXPENSE_RELIEF_PLAN.reimbursementRate * 100).toFixed(0)}% back, capped at $${EXPENSE_RELIEF_PLAN.monthlyPayoutCap.toFixed(0)}/mo and $${EXPENSE_RELIEF_PLAN.annualPayoutCap.toFixed(0)}/yr per member.`,
  },
  {
    id: "not_fr2p",
    title: "Not a rewards / affiliate program",
    body: "Expense Relief reimburses verified out-of-pocket costs. FR2P Club and FARSUP stay separate for rewards and affiliate growth.",
  },
] as const;

/** What members may file — real money they already paid out of pocket. */
export const ACCEPTABLE_CLAIMS = [
  {
    group: "Healthcare & medical",
    items: [
      "Copays, deductibles, and coinsurance you paid",
      "Prescription and qualifying OTC medications",
      "Mental health therapy, chiropractic, physical therapy sessions",
      "Vision care — exams, glasses, contacts",
      "Medical supplies (bandages, braces, glucose strips, etc.)",
    ],
  },
  {
    group: "Dental",
    items: [
      "Cleanings, exams, fillings, crowns, bridges",
      "Root canals, extractions, orthodontics with paid invoices",
    ],
  },
  {
    group: "Veterinary",
    items: [
      "Wellness visits, vaccinations, medications",
      "Emergency visits, diagnostics, surgery, dental cleaning for pets",
      "Specialty care with itemized paid receipts",
    ],
  },
  {
    group: "Insurance-related out-of-pocket",
    items: [
      "Non-covered or partially covered services you paid yourself",
      "Out-of-network fees and higher prescription tiers you paid",
    ],
  },
  {
    group: "Tolls, tickets & violations",
    items: [
      "Paid toll bills",
      "Paid parking tickets and traffic fines",
      "Paid administrative / court processing fees tied to those fines",
    ],
  },
  {
    group: "Household, work & fees",
    items: [
      "Essential utility shortfalls and necessary repairs you paid",
      "Required childcare gaps, commuting, work/school supplies, uniforms",
      "Bank, late, and documented service/processing fees you paid",
    ],
  },
] as const;

/** What is not eligible — keeps the program from becoming a catch-all cash grab. */
export const NOT_ACCEPTABLE_CLAIMS = [
  {
    group: "Not real paid expenses",
    items: [
      "Estimates, quotes, or unpaid invoices",
      "Expenses someone else paid for you with no proof you reimbursed them",
      "Duplicate claims for the same receipt",
      "Altered, photoshopped, or incomplete receipts",
    ],
  },
  {
    group: "Lifestyle & luxury",
    items: [
      "Vacations, entertainment, streaming, gaming, hobbies",
      "Luxury goods, jewelry, designer fashion",
      "Elective cosmetic procedures not medically necessary",
      "Alcohol, tobacco, recreational cannabis, illegal purchases",
    ],
  },
  {
    group: "Money transfers & debt",
    items: [
      "Cash advances, payday loans, credit-card payments, or loan principal (use Pocket Booster cushions for bridge cash)",
      "Investments, crypto, gambling losses, money sent to friends/family",
      "Rent or mortgage as a blanket claim without an eligible documented shortfall category",
    ],
  },
  {
    group: "Insurance premiums & program fees",
    items: [
      "Monthly insurance premiums (health, auto, life, pet) as the claim itself",
      "Expense Relief membership fees or the $100 acceleration fee",
      "Pocket Booster subscription fees or FR2P / FARSUP program fees",
    ],
  },
  {
    group: "Fraud & non-verification",
    items: [
      "Claims without merchant name, service date, recipient name, and proof of payment",
      "Expenses from businesses that cannot be verified as legitimate",
      "Charges that do not match the member or pet named on the receipt",
    ],
  },
] as const;

export function reimbursementForAmount(expenseAmount: number): number {
  if (!Number.isFinite(expenseAmount) || expenseAmount <= 0) return 0;
  return (
    Math.round(expenseAmount * EXPENSE_RELIEF_PLAN.reimbursementRate * 100) /
    100
  );
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
  accelerationFee: number;
  membershipActive: boolean;
};

/**
 * First-claim gate modeled on UDS:
 * - Active membership required
 * - Wait firstClaimWaitDays, OR pay accelerationFee to file early
 */
export function evaluateFirstClaimEligibility(input: {
  membershipActive: boolean;
  membershipStartedAt: Date | string | null;
  accelerationPaid: boolean;
  hasPriorClaim: boolean;
  now?: Date;
}): ClaimEligibility {
  const accelerationFee = EXPENSE_RELIEF_PLAN.accelerationFee;
  if (!input.membershipActive) {
    return {
      canFile: false,
      reason: "Activate the Premier membership before filing a claim.",
      waitingDaysRemaining: EXPENSE_RELIEF_PLAN.firstClaimWaitDays,
      accelerationFeeRequired: false,
      accelerationFee,
      membershipActive: false,
    };
  }

  // After the first claim (or once wait is satisfied / acceleration paid),
  // subsequent claims only need an active membership + caps / vault checks.
  if (input.hasPriorClaim || input.accelerationPaid) {
    return {
      canFile: true,
      reason: input.accelerationPaid
        ? "Acceleration fee on file — early filing unlocked. Payouts still require vault capital after verification."
        : "Waiting period satisfied — you may submit claims. Payouts still require vault capital after verification.",
      waitingDaysRemaining: 0,
      accelerationFeeRequired: false,
      accelerationFee,
      membershipActive: true,
    };
  }

  const elapsed = input.membershipStartedAt
    ? daysSince(input.membershipStartedAt, input.now ?? new Date())
    : 0;
  const remaining = Math.max(
    0,
    EXPENSE_RELIEF_PLAN.firstClaimWaitDays - elapsed,
  );

  if (remaining <= 0) {
    return {
      canFile: true,
      reason: "30-day seasoning complete — you may submit your first claim.",
      waitingDaysRemaining: 0,
      accelerationFeeRequired: false,
      accelerationFee,
      membershipActive: true,
    };
  }

  return {
    canFile: false,
    reason: `First claim opens in ${remaining} day${remaining === 1 ? "" : "s"}. Do not want to wait? Pay the $${accelerationFee.toFixed(0)} acceleration fee on top of your membership fee to file now. That fee unlocks early filing only — payouts still need vault capital.`,
    waitingDaysRemaining: remaining,
    accelerationFeeRequired: true,
    accelerationFee,
    membershipActive: true,
  };
}

export function applyPayoutCaps(input: {
  requestedPayout: number;
  paidThisMonth: number;
  paidThisYear: number;
}): { allowedPayout: number; capped: boolean; reason?: string } {
  const monthlyRoom = Math.max(
    0,
    EXPENSE_RELIEF_PLAN.monthlyPayoutCap - input.paidThisMonth,
  );
  const annualRoom = Math.max(
    0,
    EXPENSE_RELIEF_PLAN.annualPayoutCap - input.paidThisYear,
  );
  const room = Math.min(monthlyRoom, annualRoom);
  const allowed = Math.min(input.requestedPayout, room);
  if (allowed <= 0) {
    return {
      allowedPayout: 0,
      capped: true,
      reason:
        monthlyRoom <= 0
          ? `Monthly payout cap of $${EXPENSE_RELIEF_PLAN.monthlyPayoutCap.toFixed(0)} reached.`
          : `Annual payout cap of $${EXPENSE_RELIEF_PLAN.annualPayoutCap.toFixed(0)} reached.`,
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
  /** Reserved for future plan ids — today only "premier" exists. */
  planId: z.literal("premier").default("premier"),
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
