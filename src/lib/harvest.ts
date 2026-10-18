import type { BudgetBill, BudgetSettings } from "./store";

export const MILEAGE_RATE = 0.725;
export const SE_TAX_RATE = 15.3;

export type MonthRow = {
  i: number;
  order: number;
  income: number;
  tax: number;
  net: number;
  paycheck: number;
  delta: number;
  balance: number;
  short: boolean;
};

export type Quarter = {
  id: string;
  months: number[];
  income: number;
  tax: number;
  due: string;
};

export type HarvestPlan = {
  entered: number;
  gross: number;
  mileageDeduction: number;
  taxAnnual: number;
  net: number;
  steady: number;
  essentials: number;
  extras: number;
  billsTotal: number;
  surplus: number;
  rows: MonthRow[];
  minBalance: number;
  minBalanceMonth: number;
  peakReserve: number;
  reserveNeeded: number;
  safePaycheck: number;
  feasible: boolean;
  highMonths: number[];
  lowMonths: number[];
  leanMonths: number[];
  longestLeanRun: number;
  runwayWeeks: number;
  quarters: Quarter[];
  peakWeeks: number;
  savePerPeakWeek: number;
};

export function billsTotals(bills: BudgetBill[]) {
  const essentials = bills.filter((b) => b.essential).reduce((a, b) => a + b.amount, 0);
  const extras = bills.filter((b) => !b.essential).reduce((a, b) => a + b.amount, 0);
  return { essentials, extras, total: essentials + extras };
}

function monthOrder(startMonth: number) {
  return Array.from({ length: 12 }, (_, k) => (startMonth + k) % 12);
}

function simulate(order: number[], net: number[], paycheck: number, opening: number) {
  let bal = opening;
  const balances: number[] = [];
  for (const m of order) {
    bal += (net[m] ?? 0) - paycheck;
    balances.push(bal);
  }
  return balances;
}

function solveSafePaycheck(order: number[], net: number[], opening: number, ceiling: number) {
  const ok = (p: number) => Math.min(...simulate(order, net, p, opening)) >= -0.5;
  if (ok(ceiling)) return ceiling;
  let lo = 0;
  let hi = ceiling;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (ok(mid)) lo = mid;
    else hi = mid;
  }
  return Math.floor(lo);
}

const QUARTERS: { id: string; months: number[]; due: string }[] = [
  { id: "q1", months: [0, 1, 2], due: "04-15" },
  { id: "q2", months: [3, 4], due: "06-15" },
  { id: "q3", months: [5, 6, 7], due: "09-15" },
  { id: "q4", months: [8, 9, 10, 11], due: "01-15" },
];

export function buildHarvestPlan(income: (number | null)[], s: BudgetSettings): HarvestPlan | null {
  const entered = income.filter((v) => v !== null && v > 0).length;
  if (entered === 0) return null;

  const months = income.map((v) => (v && v > 0 ? v : 0));
  const gross = months.reduce((a, b) => a + b, 0);

  const mileageDeduction =
    s.taxEnabled && s.milesPerWeek ? Math.round(s.milesPerWeek * 52 * MILEAGE_RATE) : 0;
  const taxable = Math.max(0, gross - mileageDeduction);
  const taxAnnual = s.taxEnabled ? Math.round((taxable * s.taxRatePct) / 100) : 0;

  const taxByMonth = months.map((m) => (gross > 0 ? (m / gross) * taxAnnual : 0));
  const netByMonth = months.map((m, i) => m - (taxByMonth[i] ?? 0));
  const net = netByMonth.reduce((a, b) => a + b, 0);

  const { essentials, extras, total: billsTotal } = billsTotals(s.bills);

  const steady = Math.round(net / 12);
  const order = monthOrder(s.startMonth);
  const opening = Math.max(0, s.cashOnHand);

  const safePaycheck = solveSafePaycheck(order, netByMonth, opening, steady);
  const feasible = safePaycheck >= steady - 1;
  const paycheck = feasible ? steady : safePaycheck;

  const balances = simulate(order, netByMonth, paycheck, opening);
  const rows: MonthRow[] = order.map((m, k) => {
    const inc = months[m] ?? 0;
    const tax = Math.round(taxByMonth[m] ?? 0);
    const n = Math.round(netByMonth[m] ?? 0);
    const bal = Math.round(balances[k] ?? 0);
    return {
      i: m,
      order: k,
      income: inc,
      tax,
      net: n,
      paycheck,
      delta: Math.round(n - paycheck),
      balance: bal,
      short: bal < 0,
    };
  });

  let minBalance = Infinity;
  let minBalanceMonth = order[0] ?? 0;
  let peakReserve = 0;
  for (const r of rows) {
    if (r.balance < minBalance) {
      minBalance = r.balance;
      minBalanceMonth = r.i;
    }
    if (r.balance > peakReserve) peakReserve = r.balance;
  }
  if (!Number.isFinite(minBalance)) minBalance = 0;

  const bare = simulate(order, netByMonth, steady, 0);
  const reserveNeeded = Math.round(Math.max(0, -Math.min(...bare, 0)));

  const highMonths = months
    .map((m, i) => ({ m, i }))
    .filter((x) => x.m > steady)
    .map((x) => x.i);
  const lowMonths = months
    .map((m, i) => ({ m, i }))
    .filter((x) => x.m < steady)
    .map((x) => x.i);
  const leanMonths = netByMonth
    .map((n, i) => ({ n, i }))
    .filter((x) => essentials > 0 && x.n < essentials)
    .map((x) => x.i);

  let longestLeanRun = 0;
  let run = 0;
  for (const m of [...order, ...order]) {
    if (leanMonths.includes(m)) {
      run++;
      longestLeanRun = Math.max(longestLeanRun, Math.min(run, 12));
    } else run = 0;
  }

  const weeklyNeed = essentials > 0 ? (essentials * 12) / 52 : 0;
  const runwayWeeks = weeklyNeed > 0 ? Math.floor(opening / weeklyNeed) : 0;

  const quarters: Quarter[] = QUARTERS.map((q) => {
    const qIncome = q.months.reduce((a, m) => a + (months[m] ?? 0), 0);
    return {
      id: q.id,
      months: q.months,
      income: Math.round(qIncome),
      tax: Math.round(gross > 0 ? (qIncome / gross) * taxAnnual : 0),
      due: q.due,
    };
  });

  const peakWeeks = Math.max(1, Math.round((highMonths.length * 52) / 12));
  const savePerPeakWeek = Math.round(reserveNeeded / peakWeeks);

  return {
    entered,
    gross: Math.round(gross),
    mileageDeduction,
    taxAnnual,
    net: Math.round(net),
    steady,
    essentials,
    extras,
    billsTotal,
    surplus: Math.round(paycheck - essentials),
    rows,
    minBalance,
    minBalanceMonth,
    peakReserve,
    reserveNeeded,
    safePaycheck,
    feasible,
    highMonths,
    lowMonths,
    leanMonths,
    longestLeanRun,
    runwayWeeks,
    quarters,
    peakWeeks,
    savePerPeakWeek,
  };
}

export type ScenarioKind = "short" | "rain" | "prices" | "injury";

export type ScenarioResult = {
  kind: ScenarioKind;
  gross: number;
  steady: number;
  minBalance: number;
  monthsCovered: number;
  safePaycheck: number;
  essentialGap: number;
};

export function runScenario(
  income: (number | null)[],
  s: BudgetSettings,
  kind: ScenarioKind,
): ScenarioResult | null {
  const base = buildHarvestPlan(income, s);
  if (!base) return null;
  const months = income.map((v) => (v && v > 0 ? v : 0));
  const peak = [...months].sort((a, b) => b - a);
  const topTwo = new Set(
    months
      .map((m, i) => ({ m, i }))
      .sort((a, b) => b.m - a.m)
      .slice(0, 2)
      .map((x) => x.i),
  );
  const adjusted = months.map((m, i) => {
    if (kind === "short") return topTwo.has(i) ? m * 0.6 : m;
    if (kind === "rain") return m * (peak[0] && m >= (peak[0] ?? 0) * 0.6 ? 0.85 : 1);
    if (kind === "prices") return m * 0.85;
    return i === (peak.length ? months.indexOf(peak[0] ?? 0) : 0) ? m * 0.3 : m;
  });
  const plan = buildHarvestPlan(adjusted, s);
  if (!plan) return null;
  return {
    kind,
    gross: plan.gross,
    steady: plan.steady,
    minBalance: Math.min(
      ...simulate(
        monthOrder(s.startMonth),
        adjusted.map((m) => m - (plan.gross > 0 ? (m / plan.gross) * plan.taxAnnual : 0)),
        base.rows[0]?.paycheck ?? base.safePaycheck,
        s.cashOnHand,
      ),
    ),
    monthsCovered:
      plan.essentials > 0 ? Math.floor(Math.max(0, plan.peakReserve) / plan.essentials) : 0,
    safePaycheck: plan.safePaycheck,
    essentialGap: Math.max(0, plan.essentials - plan.safePaycheck),
  };
}
