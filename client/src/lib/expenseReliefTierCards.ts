import tierStarter from "@assets/expense-relief/tier_starter_10.jpeg";
import tierBasic from "@assets/expense-relief/tier_basic_20.jpeg";
import tierPremium from "@assets/expense-relief/tier_premium_40.jpeg";
import tierElite from "@assets/expense-relief/tier_elite_60.jpeg";
import type { ExpenseReliefTierId } from "@shared/expenseRelief";

export const EXPENSE_RELIEF_TIER_CARDS: Record<ExpenseReliefTierId, string> = {
  starter: tierStarter,
  basic: tierBasic,
  premium: tierPremium,
  elite: tierElite,
};
