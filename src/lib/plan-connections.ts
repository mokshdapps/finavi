import type { AppData } from "./store";
import { cashForecast, localDay, type CashEvent, type MoneyPlan } from "./money-plan";
import { tandaMath } from "./finance";

export function validCalendarDay(day: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const parsed = new Date(`${day}T12:00:00`);
  return Number.isFinite(parsed.getTime()) && localDay(parsed) === day;
}

export function planFocus(plan: MoneyPlan, today = localDay()) {
  const forecast = cashForecast(plan, today);
  const key: "gap" | "buffer" | "start" | "clear" =
    forecast.lowest < 0
      ? "gap"
      : forecast.lowest < plan.protected
        ? "buffer"
        : !plan.events.length
          ? "start"
          : "clear";
  return {
    key,
    amount:
      key === "gap"
        ? -forecast.lowest
        : key === "buffer"
          ? plan.protected - forecast.lowest
          : forecast.safe,
    date: forecast.gapDate,
  };
}

export function planCommitments(data: AppData, today = localDay()) {
  const bills = data.budget.bills
    .filter((bill) => bill.amount > 0)
    .map((bill) => ({
      id: `budget:${bill.id}:${today.slice(0, 7)}`,
      label: bill.label,
      amount: bill.amount,
      date: today,
      source: "budget" as const,
    }));
  const tandas = data.tandas.flatMap((tanda) => {
    const next = tandaMath(tanda);
    if (!next.nextUnpaidRound || tanda.contribution <= 0) return [];
    return [
      {
        id: `tanda:${tanda.id}:${next.nextUnpaidRound}`,
        label: tanda.name,
        amount: tanda.contribution,
        date: next.nextDate ? localDay(next.nextDate) : today,
        source: "tanda" as const,
      },
    ];
  });
  return [...bills, ...tandas].filter(
    (item) => !data.moneyPlan.events.some((event) => event.id === item.id),
  );
}

export function addCommitment(
  plan: MoneyPlan,
  item: Pick<CashEvent, "id" | "label" | "amount" | "date">,
): MoneyPlan {
  if (
    !validCalendarDay(item.date) ||
    !Number.isFinite(item.amount) ||
    item.amount <= 0 ||
    plan.events.some((event) => event.id === item.id)
  )
    return plan;
  return { ...plan, events: [...plan.events, { ...item, kind: "bill", done: false }] };
}
