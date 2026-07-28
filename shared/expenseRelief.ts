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
  "paid",
  "denied",
  "cancelled",
] as const;

export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

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
        ? "Early-claim acceleration is on file — you may submit claims."
        : "Waiting period satisfied — you may submit claims.",
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
    reason: `First claim opens in ${remaining} day${remaining === 1 ? "" : "s"}, or pay the $${accelerationFee.toFixed(0)} acceleration fee to file now.`,
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
