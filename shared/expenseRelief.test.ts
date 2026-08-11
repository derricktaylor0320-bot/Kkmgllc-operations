import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ACCEPTABLE_CLAIMS,
  ACTIVATION_POLICY,
  EXPENSE_RELIEF_DEFAULTS,
  EXPENSE_RELIEF_DISCLAIMER,
  EXPENSE_RELIEF_PLAN,
  EXPENSE_RELIEF_RULES,
  EXPENSE_RELIEF_TIERS,
  NOT_ACCEPTABLE_CLAIMS,
  applyPayoutCaps,
  earlyActivationBreakdown,
  evaluateFirstClaimEligibility,
  reimbursementForAmount,
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

  it("uses a flat $125 Early Activation add-on outside tiers", () => {
    assert.equal(EXPENSE_RELIEF_DEFAULTS.earlyActivationFee, 100);
    assert.equal(EXPENSE_RELIEF_DEFAULTS.processingFee, 25);
    assert.equal(EXPENSE_RELIEF_DEFAULTS.earlyActivationTotal, 125);
    const starter = earlyActivationBreakdown(10);
    assert.equal(starter.earlyActivationTotal, 125);
    assert.equal(starter.firstMonthWithEarlyActivation, 135);
    const elite = earlyActivationBreakdown(60);
    assert.equal(elite.firstMonthWithEarlyActivation, 185);
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

    const accelerated = evaluateFirstClaimEligibility({
      membershipActive: true,
      membershipStartedAt: started,
      accelerationPaid: true,
      hasPriorClaim: false,
      now: day10,
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
    assert.equal(ACTIVATION_POLICY.earlyActivation.total, 125);
    assert.ok(ACCEPTABLE_CLAIMS.length > 0);
    assert.ok(NOT_ACCEPTABLE_CLAIMS.length > 0);
    assert.match(EXPENSE_RELIEF_DISCLAIMER, /we are not insurance/i);
  });

  it("allows verifiable work commute and member school supplies, blocks personal lifestyle", () => {
    const acceptableText = ACCEPTABLE_CLAIMS.flatMap((g) => g.items).join(" ");
    const notText = NOT_ACCEPTABLE_CLAIMS.flatMap((g) => g.items).join(" ");
    assert.match(acceptableText, /Commute to and from work/i);
    assert.match(acceptableText, /School supplies for yourself/i);
    assert.match(notText, /Haircuts|barbershop|nail salon/i);
    assert.match(notText, /Lunch money/i);
    assert.match(notText, /School supplies bought for your children/i);
  });
});
