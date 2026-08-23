import type { ExpenseReliefTier } from "@shared/expenseRelief";
import { EXPENSE_RELIEF_TIER_CARDS } from "@/lib/expenseReliefTierCards";

type ExpenseReliefTierCardProps = {
  tier: ExpenseReliefTier;
  selected?: boolean;
  active?: boolean;
  onSelect?: () => void;
  compact?: boolean;
};

export default function ExpenseReliefTierCard({
  tier,
  selected = false,
  active = false,
  onSelect,
  compact = false,
}: ExpenseReliefTierCardProps) {
  const imageSrc = EXPENSE_RELIEF_TIER_CARDS[tier.id];
  const highlighted = selected || active;

  const content = (
    <>
      <img
        src={imageSrc}
        alt={`${tier.name} — $${tier.monthlyFee}/month membership card`}
        className={`w-full object-cover ${compact ? "rounded-lg" : "rounded-xl"}`}
        loading="lazy"
      />
      {highlighted && (
        <span className="absolute right-2 top-2 rounded-full border border-primary/40 bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
          {active ? "Active" : "Selected"}
        </span>
      )}
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`group relative block w-full overflow-hidden rounded-xl border-2 text-left transition ${
          highlighted
            ? "border-primary shadow-[0_0_28px_hsl(var(--primary)/0.35)] ring-2 ring-primary/30"
            : "border-primary/15 hover:border-primary/45 hover:shadow-[0_0_18px_hsl(var(--primary)/0.18)]"
        }`}
        data-testid={`button-select-tier-${tier.id}`}
        aria-pressed={highlighted}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 border-primary/30 shadow-[0_0_24px_hsl(var(--primary)/0.2)]`}
      data-testid={`tier-card-active-${tier.id}`}
    >
      {content}
    </div>
  );
}
