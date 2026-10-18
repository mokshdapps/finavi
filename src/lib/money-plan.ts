export type CashEvent = {
  id: string;
  label: string;
  amount: number;
  date: string;
  kind: "income" | "bill";
  done: boolean;
};
export type MoneyPlan = { cash: number; protected: number; days: number; events: CashEvent[] };
export type WorkOffer = {
  gross: number;
  hours: number;
  unpaid: number;
  costs: number;
  taxPct: number;
};
export const emptyMoneyPlan = (): MoneyPlan => ({ cash: 0, protected: 0, days: 14, events: [] });
export const emptyWorkOffer = (): WorkOffer => ({
  gross: 0,
  hours: 0,
  unpaid: 0,
  costs: 0,
  taxPct: 0,
});
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function cashForecast(plan: MoneyPlan, today = localDay()) {
  const end = new Date(`${today}T12:00:00`);
  end.setDate(end.getDate() + plan.days - 1);
  const endDay = localDay(end);
  const events = plan.events
    .filter((e) => !e.done && e.date <= endDay)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || (a.kind === b.kind ? 0 : a.kind === "bill" ? -1 : 1),
    );
  let balance = plan.cash;
  let lowest = balance;
  let gapDate = today;
  const rows = events.map((event) => {
    balance += event.kind === "income" ? event.amount : -event.amount;
    if (balance < lowest) {
      lowest = balance;
      gapDate = event.date;
    }
    return { ...event, balance };
  });
  const nextIncome = events.find((e) => e.kind === "income");
  const beforePay = events
    .filter((e) => e.kind === "bill" && (!nextIncome || e.date <= nextIncome.date))
    .reduce((sum, e) => sum + e.amount, 0);
  return {
    rows,
    lowest,
    gapDate,
    end: balance,
    safe: Math.max(0, Math.min(plan.cash - beforePay, lowest) - plan.protected),
    income: events.filter((e) => e.kind === "income").reduce((s, e) => s + e.amount, 0),
    bills: events.filter((e) => e.kind === "bill").reduce((s, e) => s + e.amount, 0),
  };
}
export function completeCashEvent(plan: MoneyPlan, id: string): MoneyPlan {
  const event = plan.events.find((e) => e.id === id);
  if (!event) return plan;
  const movement = (event.kind === "income" ? event.amount : -event.amount) * (event.done ? -1 : 1);
  return {
    ...plan,
    cash: plan.cash + movement,
    events: plan.events.map((e) => (e.id === id ? { ...e, done: !e.done } : e)),
  };
}
export function offerTakeHome(offer: WorkOffer) {
  const profit = offer.gross - offer.costs;
  const reserve = (Math.max(0, profit) * offer.taxPct) / 100;
  const net = profit - reserve;
  const time = offer.hours + offer.unpaid;
  return { profit, reserve, net, hourly: time > 0 ? net / time : null };
}
