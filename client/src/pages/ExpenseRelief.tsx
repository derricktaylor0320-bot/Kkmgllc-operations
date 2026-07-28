import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  CircleX,
  FileCheck2,
  Landmark,
  Loader2,
  Rocket,
  ShieldCheck,
  TimerReset,
  Wallet,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandSectionBanner from "@/components/BrandSectionBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  ACCEPTABLE_CLAIMS,
  EXPENSE_CATEGORIES,
  EXPENSE_RELIEF_PLAN,
  EXPENSE_RELIEF_PLATFORM,
  EXPENSE_RELIEF_RULES,
  HISTORICAL_UDS_STYLE_TIERS,
  NOT_ACCEPTABLE_CLAIMS,
  reimbursementForAmount,
  type ExpenseCategoryId,
} from "@shared/expenseRelief";
import {
  P2P_INVESTMENT_AMOUNT_STEP,
  P2P_MAX_INVESTMENT_AMOUNT,
  P2P_MIN_INVESTMENT_AMOUNT,
  p2pInvestmentAmountSchema,
} from "@shared/liquidityLoop";

type PlanResponse = {
  platformName: string;
  shortName: string;
  fundingStrategy: string;
  tagline: string;
  plan: typeof EXPENSE_RELIEF_PLAN;
  categories: typeof EXPENSE_CATEGORIES;
  rules: typeof EXPENSE_RELIEF_RULES;
  acceptable: typeof ACCEPTABLE_CLAIMS;
  notAcceptable: typeof NOT_ACCEPTABLE_CLAIMS;
  historicalTiers: typeof HISTORICAL_UDS_STYLE_TIERS;
  note: string;
};

type MeResponse = {
  membership: {
    id: string;
    planId: string;
    monthlyFee: string;
    reimbursementRate: string;
    monthlyPayoutCap: string;
    annualPayoutCap: string;
    subscriptionStatus: string;
    accelerationPaidAt: string | null;
    accelerationFeePaid: string | null;
    createdAt: string | null;
  } | null;
  plan: typeof EXPENSE_RELIEF_PLAN;
  eligibility: {
    canFile: boolean;
    reason: string;
    waitingDaysRemaining: number;
    accelerationFeeRequired: boolean;
    accelerationFee: number;
    membershipActive: boolean;
  };
  claims: Array<{
    id: string;
    categoryId: string;
    expenseAmount: string;
    requestedPayout: string;
    approvedPayout: string | null;
    merchantName: string;
    status: string;
    createdAt: string | null;
  }>;
  usage: {
    paidThisMonth: number;
    paidThisYear: number;
    monthlyPayoutCap: number;
    annualPayoutCap: number;
  };
  vaultAvailable: number;
};

type VaultResponse = {
  projectTag: string;
  totalVaultContribution: number;
  availableCompensationCapital: number;
  positions: number;
  fundingStrategy: string;
};

function formatMoney(value: number | string) {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (!Number.isFinite(n)) return "$0.00";
  return `$${n.toFixed(2)}`;
}

function errorMessage(err: unknown, fallback: string) {
  if (!(err instanceof Error)) return fallback;
  const raw = err.message.replace(/^\d+:\s*/, "");
  try {
    const parsed = JSON.parse(raw) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    // not JSON
  }
  return raw || fallback;
}

export default function ExpenseRelief() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: catalog } = useQuery<PlanResponse>({
    queryKey: ["/api/expense-relief/plan"],
  });

  const { data: me, isLoading: meLoading } = useQuery<MeResponse>({
    queryKey: ["/api/expense-relief/me"],
    enabled: isAuthenticated,
  });

  const { data: vault } = useQuery<VaultResponse>({
    queryKey: ["/api/expense-relief/vault"],
  });

  const plan = catalog?.plan ?? EXPENSE_RELIEF_PLAN;
  const categories = catalog?.categories ?? EXPENSE_CATEGORIES;
  const rules = catalog?.rules ?? EXPENSE_RELIEF_RULES;
  const acceptable = catalog?.acceptable ?? ACCEPTABLE_CLAIMS;
  const notAcceptable = catalog?.notAcceptable ?? NOT_ACCEPTABLE_CLAIMS;
  const historical = catalog?.historicalTiers ?? HISTORICAL_UDS_STYLE_TIERS;
  const membership = me?.membership ?? null;
  const eligibility = me?.eligibility;
  const vaultAvailable =
    vault?.availableCompensationCapital ?? me?.vaultAvailable ?? 0;
  const vaultCanPay = vaultAvailable > 0;

  const [categoryId, setCategoryId] = useState<ExpenseCategoryId>("healthcare");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [investAmount, setInvestAmount] = useState(
    String(P2P_MIN_INVESTMENT_AMOUNT),
  );

  const parsedExpense = Number(expenseAmount);
  const previewPayout = Number.isFinite(parsedExpense)
    ? reimbursementForAmount(parsedExpense)
    : 0;

  const parsedInvestAmount = Number(investAmount);
  const isInvestAmountValid =
    investAmount.trim() !== "" &&
    p2pInvestmentAmountSchema.safeParse(parsedInvestAmount).success;

  const activateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/expense-relief/activate", {
        planId: "premier",
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/expense-relief/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/expense-relief/vault"] });
      toast({ title: "Membership activated", description: data.message });
    },
    onError: (err: unknown) => {
      toast({
        title: "Could not activate",
        description: errorMessage(err, "Activation failed."),
        variant: "destructive",
      });
    },
  });

  const accelerationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "POST",
        "/api/expense-relief/pay-acceleration",
        { confirm: true },
      );
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/expense-relief/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/expense-relief/vault"] });
      toast({ title: "Acceleration on file", description: data.message });
    },
    onError: (err: unknown) => {
      toast({
        title: "Acceleration failed",
        description: errorMessage(err, "Could not record fee."),
        variant: "destructive",
      });
    },
  });

  const claimMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/expense-relief/claims", {
        categoryId,
        expenseAmount: parsedExpense,
        merchantName,
        serviceDate,
        recipientName,
        description,
        evidenceNotes,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/expense-relief/me"] });
      setExpenseAmount("");
      setMerchantName("");
      setServiceDate("");
      setRecipientName("");
      setDescription("");
      setEvidenceNotes("");
      toast({ title: "Claim submitted", description: data.message });
    },
    onError: (err: unknown) => {
      toast({
        title: "Claim not accepted",
        description: errorMessage(err, "Could not submit claim."),
        variant: "destructive",
      });
    },
  });

  const investMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/liquidity/invest", {
        investmentAmount: parsedInvestAmount,
        projectTag: EXPENSE_RELIEF_PLATFORM.programTag,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/expense-relief/vault"] });
      queryClient.invalidateQueries({ queryKey: ["/api/liquidity/me"] });
      toast({
        title: "Vault capital added",
        description:
          data.message ||
          "Your RPUs went into the Expense Relief Compensation Vault.",
      });
    },
    onError: (err: unknown) => {
      toast({
        title: "Investment failed",
        description: errorMessage(err, "Could not add vault capital."),
        variant: "destructive",
      });
    },
  });

  const howItWorks = useMemo(
    () => [
      {
        icon: Wallet,
        title: "One Premier membership",
        body: `$${plan.monthlyMembershipFee.toFixed(0)}/mo — up to ${(plan.reimbursementRate * 100).toFixed(0)}% back on verified out-of-pocket costs. No $10/$20/$30 maze.`,
      },
      {
        icon: TimerReset,
        title: "Don't want to wait 30 days?",
        body: `First claim opens after ${plan.firstClaimWaitDays} days. Prefer not to wait? Pay membership + the $${plan.accelerationFee.toFixed(0)} acceleration fee to file early. That $100 unlocks filing only — it is not a payout.`,
      },
      {
        icon: FileCheck2,
        title: "Submit a claim application",
        body: `Fill out the in-app application with merchant, receipt details, and proof you paid. Review takes ${plan.reviewHoursMin} hours to about a week.`,
      },
      {
        icon: Landmark,
        title: "No vault money = no payout",
        body: "Membership fees, the $100 acceleration fee, and Empire Invest capital fund the Compensation Vault. If the vault is empty, approved claims wait — nobody gets paid until capital is there. Works beside Pocket Booster cushions.",
      },
    ],
    [plan],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-primary/20">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 20% 20%, hsl(var(--primary)/0.22), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, hsl(38 70% 40% / 0.18), transparent 50%), linear-gradient(165deg, hsl(345 45% 7%), hsl(345 40% 11%) 45%, hsl(220 25% 8%))",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, hsl(var(--primary)) 0 1px, transparent 1px 14px)",
            }}
          />

          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
            <BrandSectionBanner compact />
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mt-8 max-w-3xl"
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
                Standalone Empire program · later FR2P-ready
              </p>
              <h1 className="font-brand text-4xl font-bold tracking-wide text-foreground sm:text-5xl lg:text-6xl">
                Consolidated{" "}
                <span className="gold-shine">Expense Relief</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {catalog?.tagline ?? EXPENSE_RELIEF_PLATFORM.tagline} One solid
                Premier plan — inspired by the old UDS model that kept the
                strongest membership and dropped the rest.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {isAuthenticated ? (
                  membership?.subscriptionStatus === "active" ? (
                    <Button
                      asChild
                      className="bg-primary text-primary-foreground"
                    >
                      <a href="#claim-application">Open claim application</a>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => activateMutation.mutate()}
                      disabled={activateMutation.isPending}
                      className="bg-primary text-primary-foreground"
                      data-testid="button-activate-expense-relief"
                    >
                      {activateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Activate Premier · {formatMoney(plan.monthlyMembershipFee)}
                      /mo
                    </Button>
                  )
                ) : (
                  <Button asChild className="bg-primary text-primary-foreground">
                    <Link href="/auth">Sign in to join</Link>
                  </Button>
                )}
                <Button asChild variant="outline">
                  <a href="#claim-application">Claim application</a>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/pocket-booster">Pocket Booster</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/invest">Empire Invest</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.55 }}
              className="mt-12 grid gap-4 sm:grid-cols-3"
            >
              {[
                {
                  label: "Reimbursement",
                  value: `Up to ${(plan.reimbursementRate * 100).toFixed(0)}%`,
                },
                {
                  label: "Monthly payout cap",
                  value: formatMoney(plan.monthlyPayoutCap),
                },
                {
                  label: "Vault available",
                  value: formatMoney(vaultAvailable),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-primary/25 bg-background/40 px-5 py-4 backdrop-blur-sm"
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] text-primary">
                    {stat.label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-primary">
              Why one plan — not four
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              UDS once sold $10 / $20 / $30 / $40 memberships. The $40 plan paid
              the biggest share back, so the lower tiers got retired. We start
              there: one Premier offer, clear rules, real verification.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.06 }}
                className="flex gap-4 rounded-xl border border-primary/20 bg-card/40 p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/35 bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 overflow-x-auto rounded-xl border border-dashed border-primary/30 bg-black/20 p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
              Historical UDS-style ladder (not offered)
            </p>
            <div className="grid min-w-[520px] grid-cols-4 gap-2">
              {historical.map((tier) => (
                <div
                  key={tier.monthlyFee}
                  className={`rounded-lg border px-3 py-3 ${
                    tier.monthlyFee === 40
                      ? "border-primary/50 bg-primary/10"
                      : "border-border/60 bg-background/30 opacity-70"
                  }`}
                >
                  <p className="font-display text-sm font-bold">
                    ${tier.monthlyFee}/mo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ~{(tier.reimbursementRate * 100).toFixed(0)}% back
                  </p>
                  <p className="mt-2 text-[10px] leading-snug text-muted-foreground">
                    {tier.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="acceptable"
          className="border-y border-primary/15 bg-black/20 py-16"
          data-testid="section-acceptable-claims"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-primary">
              What&apos;s acceptable — and what&apos;s not
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Expense Relief only reimburses verified out-of-pocket costs you
              already paid. It is not FR2P rewards and not a Pocket Booster
              cash cushion.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-xl border border-primary/25 bg-background/35 p-4"
                  data-testid={`rule-${rule.id}`}
                >
                  <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
                    {rule.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {rule.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                <div className="mb-4 flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                    Acceptable
                  </h3>
                </div>
                <div className="space-y-4">
                  {acceptable.map((group) => (
                    <div key={group.group}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400/90">
                        {group.group}
                      </p>
                      <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                        {group.items.map((item) => (
                          <li key={item}>· {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
                <div className="mb-4 flex items-center gap-2 text-red-400">
                  <CircleX className="h-5 w-5" />
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                    Not acceptable
                  </h3>
                </div>
                <div className="space-y-4">
                  {notAcceptable.map((group) => (
                    <div key={group.group}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400/90">
                        {group.group}
                      </p>
                      <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                        {group.items.map((item) => (
                          <li key={item}>· {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-primary/15 py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/40 to-background p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary">
                  <Rocket className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold uppercase tracking-wide text-primary">
                    Works with Pocket Booster
                  </h2>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                    Need bridge cash before payday? Use Pocket Booster cushions.
                    Already paid a medical, dental, vet, or toll bill out of
                    pocket? File an Expense Relief claim application here.
                    Same Empire hub login — two tools, different jobs.
                  </p>
                </div>
              </div>
              <Button asChild data-testid="button-open-pocket-booster-from-cer">
                <Link href="/pocket-booster">Open Pocket Booster</Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="member-desk"
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-primary">
                Member desk
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Activate, wait or accelerate, then file a verified claim.
              </p>
            </div>
            {membership?.subscriptionStatus === "active" && (
              <div className="flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Premier active
              </div>
            )}
          </div>

          {authLoading || (isAuthenticated && meLoading) ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading membership…
            </div>
          ) : !isAuthenticated ? (
            <div className="rounded-xl border border-primary/25 bg-card/40 p-8 text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Sign in with your Empire hub account to activate Expense Relief.
              </p>
              <Button asChild className="mt-4">
                <Link href="/auth">Sign in</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4 rounded-xl border border-primary/25 bg-card/40 p-6">
                <h3 className="font-display text-xl font-bold uppercase tracking-wide">
                  Membership status
                </h3>
                {membership?.subscriptionStatus === "active" ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {formatMoney(membership.monthlyFee)}/mo · up to{" "}
                      {(parseFloat(membership.reimbursementRate) * 100).toFixed(
                        0,
                      )}
                      % back · caps{" "}
                      {formatMoney(membership.monthlyPayoutCap)}/mo and{" "}
                      {formatMoney(membership.annualPayoutCap)}/yr
                    </p>
                    {eligibility && (
                      <div className="rounded-lg border border-primary/20 bg-background/40 p-4 text-sm">
                        <div className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                          <Clock3 className="h-4 w-4 text-primary" />
                          First-claim gate
                        </div>
                        <p className="text-muted-foreground">
                          {eligibility.reason}
                        </p>
                        {eligibility.accelerationFeeRequired && (
                          <Button
                            className="mt-4"
                            onClick={() => accelerationMutation.mutate()}
                            disabled={accelerationMutation.isPending}
                            data-testid="button-pay-acceleration"
                          >
                            {accelerationMutation.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Pay ${eligibility.accelerationFee.toFixed(0)} early
                            filing (on top of membership)
                          </Button>
                        )}
                      </div>
                    )}
                    {me && (
                      <p className="text-xs text-muted-foreground">
                        Used this month: {formatMoney(me.usage.paidThisMonth)} /{" "}
                        {formatMoney(me.usage.monthlyPayoutCap)} · Year:{" "}
                        {formatMoney(me.usage.paidThisYear)} /{" "}
                        {formatMoney(me.usage.annualPayoutCap)}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Join the Premier plan. Your first month seeds the
                      Compensation Vault so claims can be paid without founder
                      capital.
                    </p>
                    <Button
                      onClick={() => activateMutation.mutate()}
                      disabled={activateMutation.isPending}
                      data-testid="button-activate-expense-relief-desk"
                    >
                      {activateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Activate Premier · {formatMoney(plan.monthlyMembershipFee)}
                      /mo
                    </Button>
                  </>
                )}
              </div>

              <div
                id="claim-application"
                className="space-y-4 rounded-xl border border-primary/25 bg-card/40 p-6"
              >
                <h3 className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-wide">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Claim application
                </h3>
                <p className="text-xs text-muted-foreground">
                  This is your in-app application. Incomplete applications are
                  denied. Read{" "}
                  <a href="#acceptable" className="text-primary underline">
                    what&apos;s acceptable
                  </a>{" "}
                  first.
                </p>
                {!vaultCanPay && (
                  <div
                    className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-100"
                    data-testid="banner-vault-empty"
                  >
                    Compensation Vault available: {formatMoney(vaultAvailable)}.
                    You can still submit an application for review, but{" "}
                    <strong>you cannot get paid while the vault is empty</strong>
                    . Membership and the $100 early-file fee do not force a
                    payout.
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={categoryId}
                      onChange={(e) =>
                        setCategoryId(e.target.value as ExpenseCategoryId)
                      }
                      data-testid="select-claim-category"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount you paid</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      placeholder="125.00"
                      data-testid="input-claim-amount"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Est. back: {formatMoney(previewPayout)} at{" "}
                      {(plan.reimbursementRate * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="serviceDate">Service date</Label>
                    <Input
                      id="serviceDate"
                      type="date"
                      value={serviceDate}
                      onChange={(e) => setServiceDate(e.target.value)}
                      data-testid="input-claim-service-date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="merchant">Merchant / provider</Label>
                    <Input
                      id="merchant"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      placeholder="Clinic, pharmacy, toll authority…"
                      data-testid="input-claim-merchant"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipient">Name on receipt</Label>
                    <Input
                      id="recipient"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Your name or pet's name"
                      data-testid="input-claim-recipient"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="description">What was this for?</Label>
                    <textarea
                      id="description"
                      className="mt-1 min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Short description of the expense"
                      data-testid="input-claim-description"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="evidence">Verification notes</Label>
                    <textarea
                      id="evidence"
                      className="mt-1 min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={evidenceNotes}
                      onChange={(e) => setEvidenceNotes(e.target.value)}
                      placeholder="Invoice #, how we can verify the merchant paid status, etc."
                      data-testid="input-claim-evidence"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => claimMutation.mutate()}
                  disabled={
                    claimMutation.isPending ||
                    !membership ||
                    membership.subscriptionStatus !== "active"
                  }
                  data-testid="button-submit-claim"
                >
                  {claimMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Submit claim application
                </Button>
                <p className="text-[11px] text-muted-foreground">
                  Review window: {plan.reviewHoursMin} hours typical, up to{" "}
                  {Math.round(plan.reviewHoursMax / 24)} days. No vault capital
                  means no payout after approval.
                </p>
              </div>
            </div>
          )}

          {isAuthenticated && (me?.claims?.length ?? 0) > 0 && (
            <div className="mt-8 rounded-xl border border-primary/20 bg-card/30 p-6">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                Your claims
              </h3>
              <div className="mt-4 divide-y divide-border/60">
                {me!.claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {claim.merchantName} · {claim.categoryId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Paid {formatMoney(claim.expenseAmount)} · requested{" "}
                        {formatMoney(claim.requestedPayout)}
                      </p>
                    </div>
                    <span className="rounded-full border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {claim.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="border-t border-primary/15 bg-black/25 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-primary">
                  Compensation Vault
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Same spirit as Pocket Booster&apos;s reserve — but for
                  reimbursements, not loans. Membership and acceleration fees
                  go in first. Empire Invest RPUs can expand the pool. Yield
                  comes from subscription revenue, not your personal bank
                  account.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-primary/25 bg-background/40 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
                      Contributed
                    </p>
                    <p className="font-display text-2xl font-bold">
                      {formatMoney(vault?.totalVaultContribution ?? 0)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/25 bg-background/40 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
                      Available to pay claims
                    </p>
                    <p className="font-display text-2xl font-bold">
                      {formatMoney(vault?.availableCompensationCapital ?? 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-primary/25 bg-card/40 p-6">
                <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                  Back the vault
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Optional. Minimum {formatMoney(P2P_MIN_INVESTMENT_AMOUNT)}.
                  Non-equity Revenue Participation Units only.
                </p>
                {!isAuthenticated ? (
                  <Button asChild className="mt-4 w-full">
                    <Link href="/auth">Sign in to invest</Link>
                  </Button>
                ) : (
                  <div className="mt-4 space-y-3">
                    <Label htmlFor="invest">Amount (USD)</Label>
                    <Input
                      id="invest"
                      type="number"
                      min={P2P_MIN_INVESTMENT_AMOUNT}
                      max={P2P_MAX_INVESTMENT_AMOUNT}
                      step={P2P_INVESTMENT_AMOUNT_STEP}
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      data-testid="input-expense-relief-invest"
                    />
                    <Button
                      className="w-full"
                      disabled={!isInvestAmountValid || investMutation.isPending}
                      onClick={() => investMutation.mutate()}
                      data-testid="button-expense-relief-invest"
                    >
                      {investMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Issue RPUs to Expense Relief Vault
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/invest">Compare Empire programs</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
