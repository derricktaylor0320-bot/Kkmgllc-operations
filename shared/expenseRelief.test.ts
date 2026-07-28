import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EXPENSE_RELIEF_PLAN,
  applyPayoutCaps,
  evaluateFirstClaimEligibility,
  reimbursementForAmount,
} from "./expenseRelief";

describe("Consolidated Expense Relief", () => {
  it("pays up to 65% of verified expense amount", () => {
    assert.equal(reimbursementForAmount(100), 65);
    assert.equal(reimbursementForAmount(200), 130);
  });

  it("blocks first claim during 30-day wait unless acceleration is paid", () => {
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
    assert.equal(
      waiting.accelerationFee,
      EXPENSE_RELIEF_PLAN.accelerationFee,
    );

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

  it("opens first claim after 30 days without acceleration", () => {
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
});
