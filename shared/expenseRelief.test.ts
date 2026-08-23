import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ACCEPTABLE_CLAIMS,
  ACTIVATION_POLICY,
  categoriesForTierRate,
  EXPENSE_CATEGORIES,
  EXPENSE_RELIEF_DEFAULTS,
  EXPENSE_RELIEF_DISCLAIMER,
  EXPENSE_RELIEF_PLAN,
  EXPENSE_RELIEF_RULES,
  EXPENSE_RELIEF_TIERS,
  formatAcceptableClaimItem,
  NOT_ACCEPTABLE_CLAIMS,
  applyPayoutCaps,
  earlyActivationBreakdown,
  earlyActivationTierExamples,
  evaluateFirstClaimEligibility,
  reimbursementForAmount,
  submitExpenseClaimSchema,
} from "./expenseRelief";

describe("TCE Expense Advantage Program", () => {
  it("offers four tiers with rising reimbursement rates", () => {
    assert.equal(EXPENSE_RELIEF_TIERS.length, 4);
    assert.equal(EXPENSE_RELIEF_TIERS[0].monthlyFee, 10);
    assert.equal(EXPENSE_RELIEF_TIERS[0].reimbursementRate, 0.25);
    assert.equal(EXPENSE_RELIEF_TIERS[1].monthlyFee, 20);
    assert.equal(EXPENSE_RELIEF_TIERS[1].reimbursementRate, 0.4);
    assert.equal(EXPENSE_RELIEF_TIERS[2].monthlyFee, 40);
    assert.equal(EXPENSE_RELIEF_TIERS[2].reimbursementRate, 0.55);
    assert.equal(EXPENSE_RELIEF_TIERS[3].monthlyFee, 60);
    assert.equal(EXPENSE_RELIEF_TIERS[3].reimbursementRate, 0.65);
  });

  it("pays tier-based reimbursement percentages", () => {
    assert.equal(reimbursementForAmount(100, 0.25), 25);
    assert.equal(reimbursementForAmount(100, 0.4), 40);
    assert.equal(reimbursementForAmount(100, 0.55), 55);
    assert.equal(reimbursementForAmount(100, 0.65), 65);
  });

  it("uses a $125 Early Activation add-on plus the chosen tier fee", () => {
    assert.equal(EXPENSE_RELIEF_DEFAULTS.earlyActivationFee, 100);
    assert.equal(EXPENSE_RELIEF_DEFAULTS.processingFee, 25);
    assert.equal(EXPENSE_RELIEF_DEFAULTS.earlyActivationTotal, 125);
    const starter = earlyActivationBreakdown(10);
    assert.equal(starter.earlyActivationTotal, 125);
    assert.equal(starter.firstMonthWithEarlyActivation, 135);
    const elite = earlyActivationBreakdown(60);
    assert.equal(elite.firstMonthWithEarlyActivation, 185);
    assert.match(earlyActivationTierExamples(), /\$10 plan = \$135/);
    assert.match(earlyActivationTierExamples(), /\$60 plan = \$185/);
  });

  it("blocks first claim during 30-day wait unless Early Activation is paid", () => {
    const started = new Date("2026-07-01T00:00:00Z");
    const day10 = new Date("2026-07-11T00:00:00Z");

    const waiting = evaluateFirstClaimEligibility({
      membershipActive: true,
      membershipStartedAt: started,
      accelerationPaid: false,
      hasPriorClaim: false,
      now: day10,
    });
    assert.equal(waiting.canFile, false);
    assert.equal(waiting.waitingDaysRemaining, 20);
    assert.equal(waiting.accelerationFeeRequired, true);
    assert.equal(waiting.accelerationFee, 125);

    const acceleratedTooSoon = evaluateFirstClaimEligibility({
      membershipActive: true,
      membershipStartedAt: started,
      accelerationPaid: true,
      accelerationPaidAt: day10,
      hasPriorClaim: false,
      now: new Date("2026-07-11T12:00:00Z"),
    });
    assert.equal(acceleratedTooSoon.canFile, false);
    assert.match(acceleratedTooSoon.reason, /72 hours/i);

    const accelerated = evaluateFirstClaimEligibility({
      membershipActive: true,
      membershipStartedAt: started,
      accelerationPaid: true,
      accelerationPaidAt: day10,
      hasPriorClaim: false,
      now: new Date("2026-07-14T00:00:00Z"),
    });
    assert.equal(accelerated.canFile, true);
    assert.equal(accelerated.waitingDaysRemaining, 0);
  });

  it("opens first claim after 30 days without Early Activation", () => {
    const started = new Date("2026-07-01T00:00:00Z");
    const day31 = new Date("2026-08-01T00:00:00Z");
    const ready = evaluateFirstClaimEligibility({
      membershipActive: true,
      membershipStartedAt: started,
      accelerationPaid: false,
      hasPriorClaim: false,
      now: day31,
    });
    assert.equal(ready.canFile, true);
    assert.equal(ready.waitingDaysRemaining, 0);
  });

  it("enforces monthly and annual payout caps", () => {
    const monthly = applyPayoutCaps({
      requestedPayout: 200,
      paidThisMonth: EXPENSE_RELIEF_PLAN.monthlyPayoutCap,
      paidThisYear: EXPENSE_RELIEF_PLAN.monthlyPayoutCap,
    });
    assert.equal(monthly.allowedPayout, 0);
    assert.equal(monthly.capped, true);

    const trimmed = applyPayoutCaps({
      requestedPayout: 100,
      paidThisMonth: EXPENSE_RELIEF_PLAN.monthlyPayoutCap - 40,
      paidThisYear: 220,
    });
    assert.equal(trimmed.allowedPayout, 40);
    assert.equal(trimmed.capped, true);
  });

  it("documents vault-empty rules and official activation policy", () => {
    assert.ok(EXPENSE_RELIEF_RULES.some((r) => r.id === "vault_required"));
    assert.ok(EXPENSE_RELIEF_RULES.some((r) => r.id === "wait_or_accelerate"));
    assert.equal(
      EXPENSE_RELIEF_RULES[EXPENSE_RELIEF_RULES.length - 1]?.id,
      "wait_or_accelerate",
    );
    assert.equal(ACTIVATION_POLICY.earlyActivation.total, 125);
    assert.ok(ACCEPTABLE_CLAIMS.length > 0);
    assert.ok(NOT_ACCEPTABLE_CLAIMS.length > 0);
    assert.match(EXPENSE_RELIEF_DISCLAIMER, /we are not insurance/i);
  });

  it("lists claim categories without hardcoded tier percentages", () => {
    const labels = EXPENSE_CATEGORIES.map((c) => c.label);
    assert.deepEqual(labels, [
      "Auto Deductible",
      "Traffic Violations",
      "Toll Way Violations",
      "Cell Phone Deductible",
      "Medical Co-Pay",
      "Dental Co-Pay",
      "Vision Co-Pay",
      "Investment Program-Empire Invest",
    ]);
    assert.equal(EXPENSE_CATEGORIES.length, 8);
  });

  it("builds tier-aware category labels from membership rate", () => {
    const starter = categoriesForTierRate(0.25);
    assert.equal(starter[0]?.label, "25% Auto Deductible");
    assert.equal(
      starter[7]?.label,
      "Investment Program-Empire Invest",
    );

    const elite = categoriesForTierRate(0.65);
    assert.equal(elite[3]?.label, "65% Cell Phone Deductible");
    assert.equal(
      formatAcceptableClaimItem(
        "Auto Deductible — auto insurance deductible",
        0.4,
      ),
      "40% Auto Deductible — auto insurance deductible",
    );
  });

  it("requires receipt photo uploads on claim submission", () => {
    const missingPhotos = submitExpenseClaimSchema.safeParse({
      categoryId: "auto_deductible",
      expenseAmount: 100,
      merchantName: "Auto Shop",
      serviceDate: "2026-08-01",
      recipientName: "Jane Doe",
      receiptPhotoUrls: ["/media-files/expense-relief-receipts/one.jpg"],
    });
    assert.equal(missingPhotos.success, false);

    const valid = submitExpenseClaimSchema.safeParse({
      categoryId: "auto_deductible",
      expenseAmount: 100,
      merchantName: "Auto Shop",
      serviceDate: "2026-08-01",
      recipientName: "Jane Doe",
      receiptPhotoUrls: [
        "/media-files/expense-relief-receipts/front.jpg",
        "/media-files/expense-relief-receipts/back.jpg",
      ],
      description: "Visited around 2:30 PM — not printed on receipt.",
    });
    assert.equal(valid.success, true);
  });

  it("blocks personal lifestyle claims including commute, education, and household essentials", () => {
    const acceptableText = ACCEPTABLE_CLAIMS.flatMap((g) => g.items).join(" ");
    const notText = NOT_ACCEPTABLE_CLAIMS.flatMap((g) => g.items).join(" ");
    assert.match(acceptableText, /Auto Deductible/i);
    assert.match(acceptableText, /Cell Phone Deductible/i);
    assert.match(acceptableText, /Investment Program-Empire Invest/i);
    assert.doesNotMatch(acceptableText, /Work commute|member education|Household Essentials/i);
    assert.match(notText, /Work commute/i);
    assert.match(notText, /Member education/i);
    assert.match(notText, /Household essentials/i);
    assert.match(notText, /Haircuts|barbershop|nail salon/i);
    assert.match(notText, /Lunch money/i);
    assert.match(notText, /School supplies bought for your children/i);
  });
});
