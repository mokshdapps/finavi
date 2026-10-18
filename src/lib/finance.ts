import type { AppData, Frequency, Tanda } from "./store";

export type BudgetPlan = {
  months: number[];
  entered: number;
  annual: number;
  target: number;
  highMonths: number[];
  lowMonths: number[];
  reserve: number;
  perMonth: number[];
};

export function buildBudget(income: (number | null)[]): BudgetPlan | null {
  const entered = income.filter((v) => v !== null && v > 0).length;
  if (entered === 0) return null;
  const months = income.map((v) => (v && v > 0 ? v : 0));
  const annual = months.reduce((a, b) => a + b, 0);
  const target = Math.round(annual / 12);
  const perMonth = months.map((m) => m - target);
  const highMonths = months
    .map((m, i) => ({ m, i }))
    .filter((x) => x.m > target)
    .map((x) => x.i);
  const lowMonths = months
    .map((m, i) => ({ m, i }))
    .filter((x) => x.m < target)
    .map((x) => x.i);
  const reserve = perMonth.filter((d) => d < 0).reduce((a, b) => a - b, 0);
  return {
    months,
    entered,
    annual,
    target,
    highMonths,
    lowMonths,
    reserve: Math.round(reserve),
    perMonth,
  };
}

export function monthRangeLabel(indices: number[], monthName: (i: number) => string): string {
  const first = indices[0];
  if (first === undefined) return "-";
  const runs: number[][] = [];
  let run: number[] = [first];
  for (let k = 1; k < indices.length; k++) {
    const cur = indices[k] as number;
    const prev = indices[k - 1] as number;
    if (cur === prev + 1) run.push(cur);
    else {
      runs.push(run);
      run = [cur];
    }
  }
  runs.push(run);
  return runs
    .map((r) =>
      r.length === 1
        ? monthName(r[0] as number)
        : `${monthName(r[0] as number)}–${monthName(r[r.length - 1] as number)}`,
    )
    .join(", ");
}

export function periodInDays(period: number, unit: "days" | "weeks" | "months") {
  const mult = unit === "days" ? 1 : unit === "weeks" ? 7 : 30.4375;
  return Math.max(1, period * mult);
}

export function computeApr(received: number, repay: number, days: number) {
  const cost = repay - received;
  if (received <= 0 || cost <= 0 || days <= 0) return 0;
  return (cost / received) * (365 / days) * 100;
}

export function comparisonCost(received: number, days: number, apr = 24) {
  return (received * (apr / 100) * days) / 365;
}

export type RiskLevel = "low" | "med" | "high";
export function riskLevel(apr: number): RiskLevel {
  if (apr <= 36) return "low";
  if (apr <= 100) return "med";
  return "high";
}

export function amortPayment(
  principal: number,
  annualRatePct: number,
  periods: number,
  periodsPerYear = 12,
) {
  if (principal <= 0 || periods <= 0) return 0;
  const r = annualRatePct / 100 / periodsPerYear;
  if (r <= 0) return principal / periods;
  return (principal * r) / (1 - Math.pow(1 + r, -periods));
}

export function impliedApr(
  principal: number,
  payment: number,
  periods: number,
  periodsPerYear = 12,
) {
  const total = payment * periods;
  if (principal <= 0 || periods <= 0 || payment <= 0 || total <= principal) return 0;
  const pv = (r: number) =>
    r === 0 ? payment * periods : (payment * (1 - Math.pow(1 + r, -periods))) / r;
  let lo = 0;
  let hi = 1;
  while (pv(hi) > principal && hi < 100) hi *= 2;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (pv(mid) > principal) lo = mid;
    else hi = mid;
  }
  const periodic = (lo + hi) / 2;
  return periodic * periodsPerYear * 100;
}

export type Payoff = { months: number; interest: number; total: number; never: boolean };

export function payoffSchedule(balance: number, annualRatePct: number, payment: number): Payoff {
  const r = annualRatePct / 100 / 12;
  const firstInterest = balance * r;
  if (balance <= 0 || payment <= 0) return { months: 0, interest: 0, total: 0, never: false };
  if (payment <= firstInterest) return { months: 0, interest: 0, total: 0, never: true };
  let bal = balance;
  let interest = 0;
  let months = 0;
  while (bal > 0 && months < 1200) {
    const i = bal * r;
    interest += i;
    bal = bal + i - payment;
    months++;
  }
  return { months, interest, total: balance + interest, never: bal > 0 };
}

export const freqDays: Record<Frequency, number> = { weekly: 7, biweekly: 14, monthly: 30 };

export type TandaMath = {
  payout: number;
  totalContributions: number;
  rounds: number;
  roundDates: (Date | null)[];
  payoutDate: Date | null;
  nextUnpaidRound: number | null;
  nextDate: Date | null;
  roundsUntilPayout: number;
  netAtPayout: number;
};

export function tandaMath(t: Tanda): TandaMath {
  const rounds = t.people;
  const payout = t.people * t.contribution;
  const totalContributions = rounds * t.contribution;
  const start = t.startDate ? new Date(`${t.startDate}T12:00:00`) : null;
  const step = freqDays[t.frequency];
  const roundDates = Array.from({ length: rounds }, (_, i) => {
    if (!start) return null;
    const d = new Date(start);
    d.setDate(d.getDate() + i * step);
    return d;
  });
  let nextUnpaidRound: number | null = null;
  for (let r = 1; r <= rounds; r++) {
    if (!t.paid.includes(r)) {
      nextUnpaidRound = r;
      break;
    }
  }
  const paidCount = t.paid.filter((r) => r <= t.position).length;
  return {
    payout,
    totalContributions,
    rounds,
    roundDates,
    payoutDate: roundDates[t.position - 1] ?? null,
    nextUnpaidRound,
    nextDate: nextUnpaidRound ? (roundDates[nextUnpaidRound - 1] ?? null) : null,
    roundsUntilPayout: Math.max(0, t.position - paidCount),
    netAtPayout: payout - t.position * t.contribution,
  };
}

export type Stage = "survive" | "stabilize" | "grow" | "wealth";
export const STAGES: Stage[] = ["survive", "stabilize", "grow", "wealth"];

export type StageState = {
  stage: Stage;
  completed: Record<Stage, boolean>;
};

export function ladderState(d: AppData): StageState {
  const surviveDone = d.benefits !== null;
  const stabilizeDone = d.emergency.amount >= d.emergency.target && buildBudget(d.income) !== null;
  const growDone = d.jars.some((j) => !j.archived) || d.tandas.length > 0;
  const wealthDone = d.learnRead.length >= 4;
  const stage: Stage = !surviveDone
    ? "survive"
    : !stabilizeDone
      ? "stabilize"
      : !growDone
        ? "grow"
        : "wealth";
  return {
    stage,
    completed: {
      survive: surviveDone,
      stabilize: stabilizeDone,
      grow: growDone,
      wealth: wealthDone,
    },
  };
}

export type NextStep = {
  key: "benefits" | "cushion" | "budget" | "jar" | "learn";
  to: string;
  amount?: number;
};

export function nextStep(d: AppData): NextStep {
  if (!d.benefits) return { key: "benefits", to: "/plan/benefits" };
  if (d.emergency.amount < d.emergency.target)
    return {
      key: "cushion",
      to: "/plan/emergency",
      amount: d.emergency.target - d.emergency.amount,
    };
  if (!buildBudget(d.income)) return { key: "budget", to: "/plan/budget" };
  if (!d.jars.some((j) => !j.archived)) return { key: "jar", to: "/goals/jars" };
  return { key: "learn", to: "/learn/credit" };
}

export function isEmpty(d: AppData) {
  return (
    !d.benefits &&
    d.emergency.amount === 0 &&
    d.jars.length === 0 &&
    d.tandas.length === 0 &&
    d.spending.length === 0 &&
    d.moneyPlan.events.length === 0 &&
    d.moneyPlan.cash === 0 &&
    d.workOffers.every((o) => o.gross === 0) &&
    d.income.every((v) => !v)
  );
}
