import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  CircleX,
  ClipboardList,
  Clock3,
  FileCheck2,
  ImagePlus,
  Landmark,
  Loader2,
  Rocket,
  ShieldCheck,
  TimerReset,
  Wallet,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandSectionBanner from "@/components/BrandSectionBanner";
import ExpenseReliefTierCard from "@/components/ExpenseReliefTierCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  ACCEPTABLE_CLAIMS,
  ACTIVATION_POLICY,
  CLAIM_SUBMISSION_POLICY,
  EXPENSE_CATEGORIES,
  EXPENSE_RELIEF_DEFAULTS,
  EXPENSE_RELIEF_DISCLAIMER,
  EXPENSE_RELIEF_MAX_RECEIPT_PHOTOS,
  EXPENSE_RELIEF_MIN_RECEIPT_PHOTOS,
  EXPENSE_RELIEF_PLATFORM,
  EXPENSE_RELIEF_RULES,
  EXPENSE_RELIEF_TIERS,
  formatReimbursementPercent,
  formatAcceptableClaimItem,
  NOT_ACCEPTABLE_CLAIMS,
  earlyActivationBreakdown,
  reimbursementForAmount,
  type ExpenseCategoryId,
  type ExpenseReliefTier,
  type ExpenseReliefTierId,
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
  tiers: ExpenseReliefTier[];
  defaults: typeof EXPENSE_RELIEF_DEFAULTS;
  earlyActivationTotal: number;
  categories: typeof EXPENSE_CATEGORIES;
  rules: typeof EXPENSE_RELIEF_RULES;
  acceptable: typeof ACCEPTABLE_CLAIMS;
  notAcceptable: typeof NOT_ACCEPTABLE_CLAIMS;
  activationPolicy: typeof ACTIVATION_POLICY;
  claimSubmissionPolicy: typeof CLAIM_SUBMISSION_POLICY;
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
  tier: ExpenseReliefTier;
  eligibility: {
    canFile: boolean;
    reason: string;
    waitingDaysRemaining: number;
    accelerationFeeRequired: boolean;
    accelerationFee: number;
    earlyActivationFee: number;
    processingFee: number;
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
  availableCompensationCapital: number;
  totalVaultContribution: number;
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

  const tiers = catalog?.tiers ?? EXPENSE_RELIEF_TIERS;
  const rules = catalog?.rules ?? EXPENSE_RELIEF_RULES;
  const acceptable = catalog?.acceptable ?? ACCEPTABLE_CLAIMS;
  const notAcceptable = catalog?.notAcceptable ?? NOT_ACCEPTABLE_CLAIMS;
  const activationPolicy = catalog?.activationPolicy ?? ACTIVATION_POLICY;
  const claimPolicy = catalog?.claimSubmissionPolicy ?? CLAIM_SUBMISSION_POLICY;
  const earlyTotal =
    catalog?.earlyActivationTotal ??
    EXPENSE_RELIEF_DEFAULTS.earlyActivationTotal;
  const membership = me?.membership ?? null;
  const eligibility = me?.eligibility;
  const activeTier = me?.tier ?? null;
  const vaultAvailable =
    vault?.availableCompensationCapital ?? me?.vaultAvailable ?? 0;
  const vaultCanPay = vaultAvailable > 0;

  const [selectedTierId, setSelectedTierId] =
    useState<ExpenseReliefTierId>("starter");
  const selectedTier =
    tiers.find((t) => t.id === selectedTierId) ?? tiers[0];

  const [categoryId, setCategoryId] = useState<ExpenseCategoryId>("auto_deductible");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [receiptPhotoUrls, setReceiptPhotoUrls] = useState<string[]>([]);
  const [uploadingReceipts, setUploadingReceipts] = useState(false);
  const [receiptUploadError, setReceiptUploadError] = useState("");
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const [investAmount, setInvestAmount] = useState(
    String(P2P_MIN_INVESTMENT_AMOUNT),
  );

  useEffect(() => {
    if (membership?.planId && membership.subscriptionStatus === "active") {
      setSelectedTierId(membership.planId as ExpenseReliefTierId);
    }
  }, [membership?.planId, membership?.subscriptionStatus]);

  const rateForPreview = activeTier
    ? activeTier.reimbursementRate
    : selectedTier.reimbursementRate;
  const tierPercentLabel = formatReimbursementPercent(rateForPreview);
  const displayTier = activeTier ?? selectedTier;
  const parsedExpense = Number(expenseAmount);
  const previewPayout = Number.isFinite(parsedExpense)
    ? reimbursementForAmount(parsedExpense, rateForPreview)
    : 0;

  const parsedInvestAmount = Number(investAmount);
  const isInvestAmountValid =
    investAmount.trim() !== "" &&
    p2pInvestmentAmountSchema.safeParse(parsedInvestAmount).success;

  const earlyBreakdown = earlyActivationBreakdown(selectedTier.monthlyFee);

  const uploadReceiptPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = EXPENSE_RELIEF_MAX_RECEIPT_PHOTOS - receiptPhotoUrls.length;
    if (remaining <= 0) {
      setReceiptUploadError(
        `You can upload up to ${EXPENSE_RELIEF_MAX_RECEIPT_PHOTOS} receipt photos.`,
      );
      return;
    }
    setUploadingReceipts(true);
    setReceiptUploadError("");
    try {
      const next = [...receiptPhotoUrls];
      for (const file of Array.from(files).slice(0, remaining)) {
        const formData = new FormData();
        formData.append("photo", file);
        const res = await fetch("/api/expense-relief/claims/receipt-photos", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(body.error || "Receipt photo upload failed.");
        }
        if (body.url) next.push(body.url);
      }
      setReceiptPhotoUrls(next);
    } catch (err: unknown) {
      setReceiptUploadError(
        err instanceof Error ? err.message : "Receipt photo upload failed.",
      );
    } finally {
      setUploadingReceipts(false);
      if (receiptInputRef.current) receiptInputRef.current.value = "";
    }
  };

  const activateMutation = useMutation({
    mutationFn: async (planId: ExpenseReliefTierId) => {
      const res = await apiRequest("POST", "/api/expense-relief/activate", {
        planId,
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
      toast({ title: "Early Activation on file", description: data.message });
    },
    onError: (err: unknown) => {
      toast({
        title: "Early Activation failed",
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
        businessPhone: businessPhone || undefined,
        businessAddress: businessAddress || undefined,
        serviceDate,
        recipientName,
        description: description.trim() || undefined,
        evidenceNotes: evidenceNotes.trim() || undefined,
        receiptPhotoUrls,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/expense-relief/me"] });
      setExpenseAmount("");
      setMerchantName("");
      setBusinessPhone("");
      setBusinessAddress("");
      setServiceDate("");
      setRecipientName("");
      setDescription("");
      setEvidenceNotes("");
      setReceiptPhotoUrls([]);
      setReceiptUploadError("");
      toast({ title: "Application submitted", description: data.message });
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
          "Your RPUs went into the TCE Expense Advantage Compensation Vault.",
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
        title: "Four clean tiers",
        body: "$10 Starter (25%), $20 Basic (40%), $40 Premium (55%), $60 Elite (65%). Pick the coverage that fits.",
      },
      {
        icon: TimerReset,
        title: "30 days — or $125 Early Activation",
        body: `Wait ${EXPENSE_RELIEF_DEFAULTS.firstClaimWaitDays} days, or pay $${EXPENSE_RELIEF_DEFAULTS.earlyActivationFee.toFixed(0)} + $${EXPENSE_RELIEF_DEFAULTS.processingFee.toFixed(0)} processing = $${earlyTotal.toFixed(0)} one-time (any tier). Early Activation does not raise your %.`,
      },
      {
        icon: FileCheck2,
        title: "Claim application + verification",
        body: "Submit receipt details. Review runs 72 hours to about a week before any payout.",
      },
      {
        icon: Landmark,
        title: "No vault money = no payout",
        body: "Membership fees and Early Activation seed the Compensation Vault. Empty vault means approved claims wait. Companion to Pocket Booster cushions.",
      },
    ],
    [earlyTotal],
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
                "radial-gradient(ellipse 80% 60% at 20% 20%, hsl(var(--primary)/0.22), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, hsl(var(--accent)/0.16), transparent 50%), linear-gradient(165deg, hsl(345 45% 7%), hsl(345 40% 11%) 45%, hsl(220 25% 8%))",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
            <BrandSectionBanner compact />
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 max-w-3xl"
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
                The Consolidatus Empire · companion to Pocket Booster
              </p>
              <h1 className="font-brand text-4xl font-bold tracking-wide sm:text-5xl lg:text-6xl">
                TCE Expense{" "}
                <span className="silver-shine">Advantage</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {catalog?.tagline ?? EXPENSE_RELIEF_PLATFORM.tagline} Four
                membership tiers. Optional $125 Early Activation. Claims pay
                only when the Compensation Vault has capital.
              </p>
              <p
                className="mt-4 max-w-2xl rounded-xl border border-primary/25 bg-background/40 p-4 text-sm leading-relaxed text-muted-foreground"
                data-testid="text-expense-advantage-disclaimer"
              >
                {EXPENSE_RELIEF_DISCLAIMER}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="bg-primary text-primary-foreground">
                  <a href="#tiers">Compare tiers</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="#activation-policy">Activation policy</a>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/pocket-booster">Pocket Booster</Link>
                </Button>
              </div>
            </motion.div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Early Activation", value: formatMoney(earlyTotal) },
                {
                  label: "Top reimbursement",
                  value: "Up to 65%",
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
                  <p className="mt-1 font-display text-2xl font-bold">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="tiers"
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
          data-testid="section-tier-comparison"
        >
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-primary">
            Membership tiers
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Reimbursement % rises with the tier. Early Activation ($125) sits
            outside the tiers and works with any plan.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <ExpenseReliefTierCard
                key={tier.id}
                tier={tier}
                selected={selectedTierId === tier.id}
                active={membership?.planId === tier.id}
                onSelect={() => setSelectedTierId(tier.id)}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-primary/25 bg-black/20 p-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Selected: <strong className="text-foreground">{selectedTier.name}</strong>{" "}
              — first month with Early Activation:{" "}
              <strong className="text-foreground">
                {formatMoney(earlyBreakdown.firstMonthWithEarlyActivation)}
              </strong>{" "}
              (${selectedTier.monthlyFee} + ${earlyTotal})
            </div>
            {isAuthenticated && membership?.subscriptionStatus !== "active" && (
              <Button
                onClick={() => activateMutation.mutate(selectedTier.id)}
                disabled={activateMutation.isPending}
                data-testid="button-activate-selected-tier"
              >
                {activateMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Activate {selectedTier.name}
              </Button>
            )}
            {!isAuthenticated && (
              <Button asChild>
                <Link href="/auth">Sign in to join</Link>
              </Button>
            )}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 rounded-xl border border-primary/20 bg-card/40 p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/35 bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="activation-policy"
          className="border-y border-primary/15 bg-black/20 py-16"
          data-testid="section-activation-policy"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-primary">
              {activationPolicy.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {activationPolicy.intro}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {activationPolicy.requirements.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-primary/30 bg-background/40 p-6">
              <h3 className="font-display text-xl font-bold uppercase tracking-wide">
                {activationPolicy.earlyActivation.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {activationPolicy.earlyActivation.body}
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {activationPolicy.earlyActivation.lineItems.map((line) => (
                  <div
                    key={line.label}
                    className="rounded-lg border border-border/60 bg-black/20 px-4 py-3"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {line.label}
                    </p>
                    <p className="font-display text-xl font-bold">
                      {formatMoney(line.amount)}
                    </p>
                  </div>
                ))}
                <div className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-primary">
                    Total one-time
                  </p>
                  <p className="font-display text-xl font-bold">
                    {formatMoney(activationPolicy.earlyActivation.total)}
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                {activationPolicy.earlyActivation.notes.map((note) => (
                  <li key={note}>· {note}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="claim-policy"
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
          data-testid="section-claim-policy"
        >
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-primary">
            {claimPolicy.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            {claimPolicy.intro}
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-primary/20 bg-card/40 p-5">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                Filing requirements
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {claimPolicy.filingRequirements.map((item) => (
                  <li key={item} className="flex gap-2">
                    <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-primary/20 bg-card/40 p-5">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                Verification window
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {claimPolicy.verificationWindow.minHours} hours to{" "}
                {Math.round(claimPolicy.verificationWindow.maxHours / 24)} days.
                We check:
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {claimPolicy.verificationWindow.checks.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
              <h4 className="mt-5 font-display text-sm font-bold uppercase tracking-wide text-primary">
                Approved
              </h4>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {claimPolicy.approvedNotes.map((n) => (
                  <li key={n}>· {n}</li>
                ))}
              </ul>
              <h4 className="mt-4 font-display text-sm font-bold uppercase tracking-wide text-red-400">
                Denied when
              </h4>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {claimPolicy.deniedReasons.map((n) => (
                  <li key={n}>· {n}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="acceptable"
          className="border-y border-primary/15 bg-black/20 py-16"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-primary">
              What&apos;s acceptable — and what&apos;s not
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-xl border border-primary/25 bg-background/35 p-4"
                >
                  <h3 className="font-display text-sm font-bold uppercase tracking-wide">
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
                {acceptable.map((group) => (
                  <div key={group.group} className="mb-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400/90">
                      {group.group}
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                      {group.items.map((item) => (
                        <li key={item}>
                          · {formatAcceptableClaimItem(item, rateForPreview)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
                <div className="mb-4 flex items-center gap-2 text-red-400">
                  <CircleX className="h-5 w-5" />
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                    Not acceptable
                  </h3>
                </div>
                {notAcceptable.map((group) => (
                  <div key={group.group} className="mb-4">
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
                    Already paid a bill out of pocket? File here. Same Empire
                    hub login.
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
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-primary">
            Member desk
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Activate a tier, wait or buy Early Activation, then submit a claim
            application.
          </p>

          {authLoading || (isAuthenticated && meLoading) ? (
            <div className="mt-6 flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading membership…
            </div>
          ) : !isAuthenticated ? (
            <div className="mt-6 rounded-xl border border-primary/25 bg-card/40 p-8 text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Sign in with your Empire hub account to activate TCE Expense
                Advantage.
              </p>
              <Button asChild className="mt-4">
                <Link href="/auth">Sign in</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="space-y-4 rounded-xl border border-primary/25 bg-card/40 p-6">
                <h3 className="font-display text-xl font-bold uppercase tracking-wide">
                  Membership status
                </h3>
                <p className="text-sm text-muted-foreground">
                  {membership?.subscriptionStatus === "active"
                    ? "Your active membership card and reimbursement rate."
                    : "Choose your tier — reimbursement % varies by membership ($10 = 25%, $20 = 40%, $40 = 55%, $60 = 65%)."}
                </p>

                {membership?.subscriptionStatus === "active" && displayTier ? (
                  <div className="space-y-4">
                    <ExpenseReliefTierCard tier={displayTier} active />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">{displayTier.name}</strong>{" "}
                      · {formatMoney(membership.monthlyFee)}/mo ·{" "}
                      <strong className="text-foreground">{tierPercentLabel}</strong>{" "}
                      back on eligible deductibles · caps{" "}
                      {formatMoney(membership.monthlyPayoutCap)}/mo
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {tiers.map((tier) => (
                        <ExpenseReliefTierCard
                          key={tier.id}
                          tier={tier}
                          selected={selectedTierId === tier.id}
                          onSelect={() => setSelectedTierId(tier.id)}
                          compact
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Selected:{" "}
                      <strong className="text-foreground">{selectedTier.name}</strong>{" "}
                      · ${selectedTier.monthlyFee}/mo ·{" "}
                      <strong className="text-foreground">
                        {formatReimbursementPercent(selectedTier.reimbursementRate)}
                      </strong>{" "}
                      back · caps {formatMoney(selectedTier.monthlyPayoutCap)}/mo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your first month seeds the Compensation Vault.
                    </p>
                    <Button
                      onClick={() => activateMutation.mutate(selectedTier.id)}
                      disabled={activateMutation.isPending}
                      data-testid="button-activate-expense-relief-desk"
                    >
                      {activateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Activate {selectedTier.name} ·{" "}
                      {formatMoney(selectedTier.monthlyFee)}/mo
                    </Button>
                  </div>
                )}

                {membership?.subscriptionStatus === "active" && (
                  <>
                    {eligibility && (
                      <div className="rounded-lg border border-primary/20 bg-background/40 p-4 text-sm">
                        <div className="mb-1 flex items-center gap-2 font-semibold">
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
                            Pay Early Activation ·{" "}
                            {formatMoney(eligibility.accelerationFee)}
                          </Button>
                        )}
                      </div>
                    )}
                    {me && (
                      <p className="text-xs text-muted-foreground">
                        Used this month: {formatMoney(me.usage.paidThisMonth)} /{" "}
                        {formatMoney(me.usage.monthlyPayoutCap)}
                      </p>
                    )}
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
                {displayTier && (
                  <p className="text-xs text-muted-foreground">
                    Your <strong className="text-foreground">{displayTier.name}</strong>{" "}
                    reimburses eligible expenses at{" "}
                    <strong className="text-foreground">{tierPercentLabel}</strong>.
                    Categories below list what you can claim — your rate applies to
                    each deductible type.
                  </p>
                )}
                {!vaultCanPay && (
                  <div
                    className="rounded-lg border border-sky-500/40 bg-sky-500/10 p-3 text-xs text-sky-100"
                    data-testid="banner-vault-empty"
                  >
                    Vault available: {formatMoney(vaultAvailable)}. You can
                    still apply, but{" "}
                    <strong>you cannot get paid while the vault is empty</strong>
                    .
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
                    >
                      {EXPENSE_CATEGORIES.map((c) => (
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
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Est. back at {(rateForPreview * 100).toFixed(0)}%:{" "}
                      {formatMoney(previewPayout)}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="serviceDate">Service date</Label>
                    <Input
                      id="serviceDate"
                      type="date"
                      value={serviceDate}
                      onChange={(e) => setServiceDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="merchant">Business name</Label>
                    <Input
                      id="merchant"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Business phone</Label>
                    <Input
                      id="phone"
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                      placeholder="Optional but recommended"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Business address / location</Label>
                    <Input
                      id="address"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      placeholder="Optional but recommended"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="recipient">Name on receipt</Label>
                    <Input
                      id="recipient"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Your name or pet's name"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Receipt photos (required)</Label>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Upload clear photos of the actual receipt — front and back.
                      Include the business phone number when it appears on the receipt.
                      You can add up to {EXPENSE_RELIEF_MAX_RECEIPT_PHOTOS} photos
                      ({EXPENSE_RELIEF_MIN_RECEIPT_PHOTOS} minimum).
                    </p>
                    <input
                      ref={receiptInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      className="hidden"
                      data-testid="input-receipt-photos"
                      onChange={(e) => uploadReceiptPhotos(e.target.files)}
                    />
                    <div className="mt-3 flex flex-wrap gap-3">
                      {receiptPhotoUrls.map((url, index) => (
                        <div
                          key={url}
                          className="relative h-24 w-24 overflow-hidden rounded-lg border border-primary/30 bg-black/20"
                        >
                          <img
                            src={url}
                            alt={`Receipt photo ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
                            aria-label={`Remove receipt photo ${index + 1}`}
                            data-testid={`button-remove-receipt-photo-${index}`}
                            onClick={() =>
                              setReceiptPhotoUrls((prev) =>
                                prev.filter((item) => item !== url),
                              )
                            }
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {receiptPhotoUrls.length < EXPENSE_RELIEF_MAX_RECEIPT_PHOTOS && (
                        <button
                          type="button"
                          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-primary/40 bg-background/40 text-[10px] text-muted-foreground transition hover:border-primary hover:text-foreground"
                          data-testid="button-upload-receipt-photo"
                          disabled={uploadingReceipts}
                          onClick={() => receiptInputRef.current?.click()}
                        >
                          {uploadingReceipts ? (
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          ) : (
                            <ImagePlus className="h-5 w-5 text-primary" />
                          )}
                          Add photo
                        </button>
                      )}
                    </div>
                    {receiptUploadError && (
                      <p className="mt-2 text-xs text-red-400">{receiptUploadError}</p>
                    )}
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {receiptPhotoUrls.length} of {EXPENSE_RELIEF_MAX_RECEIPT_PHOTOS}{" "}
                      photos uploaded
                      {receiptPhotoUrls.length < EXPENSE_RELIEF_MIN_RECEIPT_PHOTOS
                        ? ` — need at least ${EXPENSE_RELIEF_MIN_RECEIPT_PHOTOS} (front + back)`
                        : ""}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="description">
                      Extra details (optional)
                    </Label>
                    <textarea
                      id="description"
                      className="mt-1 min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Visit time, context, or anything the receipt does not show…"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="evidence">Verification notes (optional)</Label>
                    <textarea
                      id="evidence"
                      className="mt-1 min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={evidenceNotes}
                      onChange={(e) => setEvidenceNotes(e.target.value)}
                      placeholder="Invoice #, how we can verify the merchant, fax number, etc."
                    />
                  </div>
                </div>
                <Button
                  onClick={() => claimMutation.mutate()}
                  disabled={
                    claimMutation.isPending ||
                    uploadingReceipts ||
                    receiptPhotoUrls.length < EXPENSE_RELIEF_MIN_RECEIPT_PHOTOS ||
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
                      <p className="font-medium">{claim.merchantName}</p>
                      <p className="text-xs text-muted-foreground">
                        Paid {formatMoney(claim.expenseAmount)} · requested{" "}
                        {formatMoney(claim.requestedPayout)}
                      </p>
                    </div>
                    <span className="rounded-full border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {claim.status.replaceAll("_", " ")}
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
                <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                  Membership fees and $125 Early Activation fees seed this
                  vault. Grants and Empire Invest RPUs can expand it. No vault
                  capital means no member payouts.
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
                      {formatMoney(vaultAvailable)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-primary/25 bg-card/40 p-6">
                <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                  Back the vault
                </h3>
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
                    />
                    <Button
                      className="w-full"
                      disabled={!isInvestAmountValid || investMutation.isPending}
                      onClick={() => investMutation.mutate()}
                    >
                      {investMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Issue RPUs to TCE Expense Advantage Vault
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
