import type { AppData } from "./store";
import { normalizeLiveData } from "./live-data";
import { buildHarvestPlan, billsTotals } from "./harvest";
import { cashForecast, localDay } from "./money-plan";

export type JourneyTaskId = "cash" | "income" | "bills" | "spending" | "goal" | "credit";
export const foundationWeights: Record<JourneyTaskId, number> = {
  cash: 20,
  income: 20,
  bills: 15,
  spending: 15,
  goal: 20,
  credit: 10,
};

export function moneyJourney(input: AppData, today = localDay()) {
  const data = normalizeLiveData(input);
  const months = data.income.filter((value) => value !== null).length;
  const sorted = data.spending.filter((item) => item.category !== "unsure").length;
  const lessons = new Set(
    data.learnRead.filter((id) => /^credit-(?:[1-9]|1[0-9]|2[0-2])$/.test(id)),
  ).size;
  const progress: Record<JourneyTaskId, number> = {
    cash: data.moneyPlan.events.length ? 1 : 0,
    income: months / 12,
    bills: data.budget.bills.length ? 1 : 0,
    spending: data.spending.length ? sorted / data.spending.length : 0,
    goal: data.jars.some((jar) => !jar.archived && jar.target !== null && jar.target > 0) ? 1 : 0,
    credit: lessons ? 1 : 0,
  };
  const points = Object.fromEntries(
    Object.entries(progress).map(([id, value]) => [
      id,
      value * foundationWeights[id as JourneyTaskId],
    ]),
  ) as Record<JourneyTaskId, number>;
  const complete = Object.values(progress).every((value) => value === 1);
  const score = Math.min(
    complete ? 100 : 99,
    Math.round(Object.values(points).reduce((sum, value) => sum + value, 0)),
  );
  const forecast = cashForecast(data.moneyPlan, today);
  const next = (Object.keys(progress) as JourneyTaskId[]).find((id) => progress[id] < 1) ?? "cash";
  const focus: JourneyTaskId = forecast.lowest < data.moneyPlan.protected ? "cash" : next;
  const cushionPct =
    data.emergency.target > 0
      ? Math.min(100, Math.round((data.emergency.amount / data.emergency.target) * 100))
      : 0;
  const goals = data.jars.filter((jar) => !jar.archived);
  const spending = { need: 0, want: 0, unsure: 0 };
  for (const item of data.spending) spending[item.category] += item.amount;
  return {
    progress,
    points,
    score,
    focus,
    months,
    sorted,
    lessons,
    forecast,
    cushionPct,
    spending,
    goalSaved: goals.reduce((sum, goal) => sum + goal.amount, 0),
    debt: data.debts.reduce((sum, debt) => sum + debt.balance, 0),
    milestone: Math.floor(score / 25) * 25,
  };
}

export function monthlyCashflow(input: AppData) {
  const data = normalizeLiveData(input);
  const harvest = buildHarvestPlan(data.income, data.budget);
  const expenses = billsTotals(data.budget.bills).total;
  let reserve: number | null = data.budget.cashOnHand;
  const rows = Array.from({ length: 12 }, (_, order) => {
    const month = (data.budget.startMonth + order) % 12;
    const entered = data.income[month] ?? null;
    const gross = harvest?.gross ?? 0;
    const tax = entered !== null && gross > 0 ? (entered / gross) * (harvest?.taxAnnual ?? 0) : 0;
    const income = entered !== null ? entered - tax : null;
    const delta = income !== null && data.budget.bills.length ? income - expenses : null;
    reserve = reserve !== null && delta !== null ? reserve + delta : null;
    return { month, income, expenses, delta, reserve };
  });
  const complete = rows.every((row) => row.delta !== null);
  return {
    rows,
    expenses,
    complete,
    endReserve: complete ? (rows[11]?.reserve ?? null) : null,
    lowest: complete
      ? Math.min(data.budget.cashOnHand, ...rows.map((row) => row.reserve ?? 0))
      : null,
  };
}
