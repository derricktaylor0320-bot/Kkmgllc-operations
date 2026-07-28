import type { Express, Request, Response } from "express";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import { requireAuth, requireOwner } from "./auth";
import type { User } from "@shared/schema";
import {
  expenseReliefClaims,
  expenseReliefMemberships,
  expenseReliefVault,
  type ExpenseReliefClaim,
  type ExpenseReliefMembership,
} from "@shared/schema";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_RELIEF_PLAN,
  EXPENSE_RELIEF_PLATFORM,
  EXPENSE_RELIEF_RULES,
  ACCEPTABLE_CLAIMS,
  NOT_ACCEPTABLE_CLAIMS,
  HISTORICAL_UDS_STYLE_TIERS,
  activateExpenseReliefSchema,
  applyPayoutCaps,
  evaluateFirstClaimEligibility,
  payAccelerationSchema,
  reimbursementForAmount,
  reviewExpenseClaimSchema,
  submitExpenseClaimSchema,
} from "@shared/expenseRelief";

function currentUser(req: Request): User {
  return req.user as User;
}

function money(n: number, decimals = 2): string {
  return n.toFixed(decimals);
}

export async function getExpenseReliefVaultAvailable(): Promise<number> {
  const [row] = await db
    .select({
      total: sql<string>`COALESCE(SUM(${expenseReliefVault.availableCapital}), 0)`,
    })
    .from(expenseReliefVault);
  return parseFloat(row?.total ?? "0");
}

export async function creditExpenseReliefVault(input: {
  amount: number;
  source: "MEMBERSHIP" | "ACCELERATION" | "INVESTOR_RPU" | "ADJUSTMENT";
  investmentId?: string | null;
  description: string;
}): Promise<void> {
  if (input.amount <= 0) return;
  const amountStr = money(input.amount);
  await db.insert(expenseReliefVault).values({
    investmentId: input.investmentId ?? null,
    source: input.source,
    contributionAmount: amountStr,
    availableCapital: amountStr,
    description: input.description,
  });
}

export async function debitExpenseReliefVault(amount: number): Promise<boolean> {
  if (amount <= 0) return true;
  let remaining = amount;

  const rows = await db
    .select()
    .from(expenseReliefVault)
    .where(sql`${expenseReliefVault.availableCapital} > 0`)
    .orderBy(expenseReliefVault.createdAt);

  const available = rows.reduce(
    (sum, row) => sum + parseFloat(row.availableCapital),
    0,
  );
  if (available + 1e-9 < amount) return false;

  for (const row of rows) {
    if (remaining <= 0) break;
    const avail = parseFloat(row.availableCapital);
    if (avail <= 0) continue;
    const take = Math.min(avail, remaining);
    const next = Math.round((avail - take) * 100) / 100;
    await db
      .update(expenseReliefVault)
      .set({
        availableCapital: money(next),
        updatedAt: new Date(),
      })
      .where(eq(expenseReliefVault.id, row.id));
    remaining = Math.round((remaining - take) * 100) / 100;
  }

  return remaining <= 1e-9;
}

async function getMembership(
  userId: string,
): Promise<ExpenseReliefMembership | undefined> {
  const [row] = await db
    .select()
    .from(expenseReliefMemberships)
    .where(eq(expenseReliefMemberships.userId, userId))
    .limit(1);
  return row;
}

async function listClaimsForUser(userId: string): Promise<ExpenseReliefClaim[]> {
  return db
    .select()
    .from(expenseReliefClaims)
    .where(eq(expenseReliefClaims.userId, userId))
    .orderBy(desc(expenseReliefClaims.createdAt));
}

function startOfMonth(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function startOfYear(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
}

async function sumPaidSince(
  userId: string,
  since: Date,
): Promise<number> {
  const [row] = await db
    .select({
      total: sql<string>`COALESCE(SUM(${expenseReliefClaims.approvedPayout}), 0)`,
    })
    .from(expenseReliefClaims)
    .where(
      and(
        eq(expenseReliefClaims.userId, userId),
        inArray(expenseReliefClaims.status, ["approved", "paid"]),
        gte(expenseReliefClaims.createdAt, since),
      ),
    );
  return parseFloat(row?.total ?? "0");
}

function membershipPayload(membership: ExpenseReliefMembership | undefined) {
  if (!membership) return null;
  return {
    id: membership.id,
    planId: membership.planId,
    monthlyFee: membership.monthlyFee,
    reimbursementRate: membership.reimbursementRate,
    monthlyPayoutCap: membership.monthlyPayoutCap,
    annualPayoutCap: membership.annualPayoutCap,
    subscriptionStatus: membership.subscriptionStatus,
    accelerationPaidAt: membership.accelerationPaidAt,
    accelerationFeePaid: membership.accelerationFeePaid,
    createdAt: membership.createdAt,
  };
}

export function registerExpenseReliefRoutes(app: Express): void {
  app.get("/api/expense-relief/plan", (_req, res) => {
    res.json({
      ...EXPENSE_RELIEF_PLATFORM,
      plan: EXPENSE_RELIEF_PLAN,
      categories: EXPENSE_CATEGORIES,
      rules: EXPENSE_RELIEF_RULES,
      acceptable: ACCEPTABLE_CLAIMS,
      notAcceptable: NOT_ACCEPTABLE_CLAIMS,
      historicalTiers: HISTORICAL_UDS_STYLE_TIERS,
      note:
        "One solid Premier plan — the old $10/$20/$30/$40 ladder is shown for history only and is not offered. The $100 acceleration fee unlocks early filing only; empty vault means no payout.",
    });
  });

  app.get("/api/expense-relief/vault", async (_req, res) => {
    try {
      const [totals] = await db
        .select({
          contributed: sql<string>`COALESCE(SUM(${expenseReliefVault.contributionAmount}), 0)`,
          available: sql<string>`COALESCE(SUM(${expenseReliefVault.availableCapital}), 0)`,
          positions: sql<string>`COUNT(*)::text`,
        })
        .from(expenseReliefVault);

      res.json({
        projectTag: EXPENSE_RELIEF_PLATFORM.programTag,
        totalVaultContribution: parseFloat(totals?.contributed ?? "0"),
        availableCompensationCapital: parseFloat(totals?.available ?? "0"),
        positions: parseInt(totals?.positions ?? "0", 10) || 0,
        fundingStrategy: EXPENSE_RELIEF_PLATFORM.fundingStrategy,
      });
    } catch (err) {
      console.error("[expense-relief] vault snapshot failed", err);
      res.status(500).json({ error: "Could not load vault snapshot." });
    }
  });

  app.get(
    "/api/expense-relief/me",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const user = currentUser(req);
        const membership = await getMembership(user.id);
        const claims = await listClaimsForUser(user.id);
        const active = membership?.subscriptionStatus === "active";
        const eligibility = evaluateFirstClaimEligibility({
          membershipActive: !!active,
          membershipStartedAt: membership?.createdAt ?? null,
          accelerationPaid: !!membership?.accelerationPaidAt,
          hasPriorClaim: claims.length > 0,
        });
        const paidThisMonth = await sumPaidSince(user.id, startOfMonth());
        const paidThisYear = await sumPaidSince(user.id, startOfYear());
        const vaultAvailable = await getExpenseReliefVaultAvailable();

        res.json({
          membership: membershipPayload(membership),
          plan: EXPENSE_RELIEF_PLAN,
          eligibility,
          claims,
          usage: {
            paidThisMonth,
            paidThisYear,
            monthlyPayoutCap: EXPENSE_RELIEF_PLAN.monthlyPayoutCap,
            annualPayoutCap: EXPENSE_RELIEF_PLAN.annualPayoutCap,
          },
          vaultAvailable,
        });
      } catch (err) {
        console.error("[expense-relief] /me failed", err);
        res.status(500).json({ error: "Could not load membership." });
      }
    },
  );

  app.post(
    "/api/expense-relief/activate",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const parsed = activateExpenseReliefSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
          return res.status(400).json({ error: "Invalid plan selection." });
        }

        const user = currentUser(req);
        const existing = await getMembership(user.id);
        if (existing?.subscriptionStatus === "active") {
          return res.json({
            membership: membershipPayload(existing),
            message: "Premier Expense Relief is already active.",
          });
        }

        const values = {
          userId: user.id,
          planId: EXPENSE_RELIEF_PLAN.id,
          monthlyFee: money(EXPENSE_RELIEF_PLAN.monthlyMembershipFee),
          reimbursementRate: money(EXPENSE_RELIEF_PLAN.reimbursementRate, 4),
          monthlyPayoutCap: money(EXPENSE_RELIEF_PLAN.monthlyPayoutCap),
          annualPayoutCap: money(EXPENSE_RELIEF_PLAN.annualPayoutCap),
          subscriptionStatus: "active" as const,
          updatedAt: new Date(),
        };

        let membership: ExpenseReliefMembership;
        if (existing) {
          const [updated] = await db
            .update(expenseReliefMemberships)
            .set(values)
            .where(eq(expenseReliefMemberships.id, existing.id))
            .returning();
          membership = updated;
        } else {
          const [created] = await db
            .insert(expenseReliefMemberships)
            .values(values)
            .returning();
          membership = created;
        }

        // First month's membership seeds the Compensation Vault (zero founder capital).
        await creditExpenseReliefVault({
          amount: EXPENSE_RELIEF_PLAN.monthlyMembershipFee,
          source: "MEMBERSHIP",
          description: `Premier membership activation — $${EXPENSE_RELIEF_PLAN.monthlyMembershipFee.toFixed(2)} into Compensation Vault`,
        });

        res.json({
          membership: membershipPayload(membership),
          message:
            "Premier Expense Relief activated. First claim opens after 30 days, or pay the $100 acceleration fee to file sooner.",
        });
      } catch (err) {
        console.error("[expense-relief] activate failed", err);
        res.status(500).json({ error: "Could not activate membership." });
      }
    },
  );

  app.post(
    "/api/expense-relief/pay-acceleration",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const parsed = payAccelerationSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
          return res
            .status(400)
            .json({ error: "Confirm the acceleration fee to continue." });
        }

        const user = currentUser(req);
        const membership = await getMembership(user.id);
        if (!membership || membership.subscriptionStatus !== "active") {
          return res
            .status(400)
            .json({ error: "Activate Premier membership first." });
        }
        if (membership.accelerationPaidAt) {
          return res.json({
            membership: membershipPayload(membership),
            message: "Acceleration fee already on file.",
          });
        }

        const fee = EXPENSE_RELIEF_PLAN.accelerationFee;
        const [updated] = await db
          .update(expenseReliefMemberships)
          .set({
            accelerationPaidAt: new Date(),
            accelerationFeePaid: money(fee),
            updatedAt: new Date(),
          })
          .where(eq(expenseReliefMemberships.id, membership.id))
          .returning();

        await creditExpenseReliefVault({
          amount: fee,
          source: "ACCELERATION",
          description: `Early-claim acceleration fee — $${fee.toFixed(2)} into Compensation Vault`,
        });

        res.json({
          membership: membershipPayload(updated),
          message:
            "Acceleration paid. Early filing is unlocked (membership + $100). Claims still need verification, and payouts only happen when the Compensation Vault has capital.",
        });
      } catch (err) {
        console.error("[expense-relief] acceleration failed", err);
        res.status(500).json({ error: "Could not record acceleration fee." });
      }
    },
  );

  app.post(
    "/api/expense-relief/claims",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const parsed = submitExpenseClaimSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
          return res.status(400).json({
            error: parsed.error.issues[0]?.message ?? "Invalid claim form.",
          });
        }

        const user = currentUser(req);
        const membership = await getMembership(user.id);
        if (!membership || membership.subscriptionStatus !== "active") {
          return res
            .status(400)
            .json({ error: "Activate Premier membership before filing." });
        }

        const priorClaims = await listClaimsForUser(user.id);
        const eligibility = evaluateFirstClaimEligibility({
          membershipActive: true,
          membershipStartedAt: membership.createdAt,
          accelerationPaid: !!membership.accelerationPaidAt,
          hasPriorClaim: priorClaims.length > 0,
        });
        if (!eligibility.canFile) {
          return res.status(400).json({ error: eligibility.reason });
        }

        const requested = reimbursementForAmount(parsed.data.expenseAmount);
        const paidThisMonth = await sumPaidSince(user.id, startOfMonth());
        const paidThisYear = await sumPaidSince(user.id, startOfYear());
        const capped = applyPayoutCaps({
          requestedPayout: requested,
          paidThisMonth,
          paidThisYear,
        });
        if (capped.allowedPayout <= 0) {
          return res.status(400).json({
            error: capped.reason ?? "Payout cap reached for this period.",
          });
        }

        const vaultAvailable = await getExpenseReliefVaultAvailable();
        const [claim] = await db
          .insert(expenseReliefClaims)
          .values({
            userId: user.id,
            membershipId: membership.id,
            categoryId: parsed.data.categoryId,
            expenseAmount: money(parsed.data.expenseAmount),
            requestedPayout: money(capped.allowedPayout),
            merchantName: parsed.data.merchantName,
            serviceDate: parsed.data.serviceDate,
            recipientName: parsed.data.recipientName,
            description: parsed.data.description,
            evidenceNotes: parsed.data.evidenceNotes,
            status: "under_review",
            updatedAt: new Date(),
          })
          .returning();

        const vaultNote =
          vaultAvailable < capped.allowedPayout
            ? " Application accepted for review, but the Compensation Vault does not currently have enough capital to pay this claim — payout waits until the vault is funded."
            : "";

        res.json({
          claim,
          vaultAvailable,
          message: capped.capped
            ? `Claim application submitted for review (72 hours–7 days). ${capped.reason}${vaultNote}`
            : `Claim application submitted for review. Typical approval is 72 hours; verification can take up to a week.${vaultNote}`,
          reviewWindow: {
            minHours: EXPENSE_RELIEF_PLAN.reviewHoursMin,
            maxHours: EXPENSE_RELIEF_PLAN.reviewHoursMax,
          },
          payoutRequiresVault: true,
        });
      } catch (err) {
        console.error("[expense-relief] claim submit failed", err);
        res.status(500).json({ error: "Could not submit claim." });
      }
    },
  );

  /** Owner review — approve or deny after legitimacy checks. */
  app.post(
    "/api/expense-relief/claims/review",
    requireAuth,
    requireOwner,
    async (req: Request, res: Response) => {
      try {
        const parsed = reviewExpenseClaimSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
          return res.status(400).json({ error: "Invalid review payload." });
        }

        const [claim] = await db
          .select()
          .from(expenseReliefClaims)
          .where(eq(expenseReliefClaims.id, parsed.data.claimId))
          .limit(1);

        if (!claim) {
          return res.status(404).json({ error: "Claim not found." });
        }
        if (!["submitted", "under_review"].includes(claim.status)) {
          return res
            .status(400)
            .json({ error: `Claim is already ${claim.status}.` });
        }

        if (parsed.data.decision === "denied") {
          const [updated] = await db
            .update(expenseReliefClaims)
            .set({
              status: "denied",
              reviewNotes: parsed.data.reviewNotes ?? "Denied after review.",
              reviewedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(expenseReliefClaims.id, claim.id))
            .returning();
          return res.json({
            claim: updated,
            message: "Claim denied.",
          });
        }

        const payout = parseFloat(claim.requestedPayout);
        const debited = await debitExpenseReliefVault(payout);
        if (!debited) {
          const [pending] = await db
            .update(expenseReliefClaims)
            .set({
              status: "approved_pending_funds",
              approvedPayout: money(payout),
              reviewNotes:
                parsed.data.reviewNotes ??
                "Verified legitimate — waiting on Compensation Vault capital before payout.",
              reviewedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(expenseReliefClaims.id, claim.id))
            .returning();
          return res.json({
            claim: pending,
            message:
              "Claim verified and approved, but the vault has no available capital — member cannot be paid until the vault is funded.",
            payoutRequiresVault: true,
          });
        }

        const [updated] = await db
          .update(expenseReliefClaims)
          .set({
            status: "paid",
            approvedPayout: money(payout),
            reviewNotes:
              parsed.data.reviewNotes ??
              "Verified legitimate expense — payout issued from Compensation Vault.",
            reviewedAt: new Date(),
            paidAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(expenseReliefClaims.id, claim.id))
          .returning();

        res.json({
          claim: updated,
          message: `Claim approved and $${payout.toFixed(2)} marked paid from the Compensation Vault.`,
        });
      } catch (err) {
        console.error("[expense-relief] review failed", err);
        res.status(500).json({ error: "Could not review claim." });
      }
    },
  );

  app.get(
    "/api/expense-relief/claims/queue",
    requireAuth,
    requireOwner,
    async (_req: Request, res: Response) => {
      try {
        const queue = await db
          .select()
          .from(expenseReliefClaims)
          .where(
            inArray(expenseReliefClaims.status, [
              "submitted",
              "under_review",
              "approved_pending_funds",
            ]),
          )
          .orderBy(expenseReliefClaims.createdAt);
        res.json({ queue });
      } catch (err) {
        console.error("[expense-relief] queue failed", err);
        res.status(500).json({ error: "Could not load claim queue." });
      }
    },
  );

  /** Pay an approved claim once the Compensation Vault has capital. */
  app.post(
    "/api/expense-relief/claims/pay-pending",
    requireAuth,
    requireOwner,
    async (req: Request, res: Response) => {
      try {
        const claimId =
          typeof req.body?.claimId === "string" ? req.body.claimId : "";
        if (!claimId) {
          return res.status(400).json({ error: "claimId is required." });
        }

        const [claim] = await db
          .select()
          .from(expenseReliefClaims)
          .where(eq(expenseReliefClaims.id, claimId))
          .limit(1);
        if (!claim) {
          return res.status(404).json({ error: "Claim not found." });
        }
        if (claim.status !== "approved_pending_funds") {
          return res.status(400).json({
            error: "Only approved-pending-funds claims can be paid from the vault.",
          });
        }

        const payout = parseFloat(
          claim.approvedPayout ?? claim.requestedPayout,
        );
        const debited = await debitExpenseReliefVault(payout);
        if (!debited) {
          return res.status(409).json({
            error:
              "Compensation Vault still does not have enough capital. Member cannot be paid yet.",
          });
        }

        const [updated] = await db
          .update(expenseReliefClaims)
          .set({
            status: "paid",
            approvedPayout: money(payout),
            paidAt: new Date(),
            updatedAt: new Date(),
            reviewNotes:
              (claim.reviewNotes ? `${claim.reviewNotes} ` : "") +
              "Payout released when vault capital became available.",
          })
          .where(eq(expenseReliefClaims.id, claim.id))
          .returning();

        res.json({
          claim: updated,
          message: `Paid $${payout.toFixed(2)} from the Compensation Vault.`,
        });
      } catch (err) {
        console.error("[expense-relief] pay-pending failed", err);
        res.status(500).json({ error: "Could not pay pending claim." });
      }
    },
  );
}
