import type { AppData } from "./store";
import { cashForecast, localDay } from "./money-plan";
import { buildHarvestPlan } from "./harvest";
import { normalizeLiveData } from "./live-data";
export type CheckIn = {
  date: string;
  ready: number;
  cashLowest: number;
  emergency: number;
  goalSaved: number;
  debt: number;
};
export function financialCheckIn(input: AppData, today = localDay()) {
  const data = normalizeLiveData(input);
  const forecast = cashForecast(data.moneyPlan, today);
  const harvest = buildHarvestPlan(data.income, data.budget);
  const started = data.moneyPlan.events.length > 0;
  const cashReady = started && forecast.lowest >= data.moneyPlan.protected;
  const seasonalReady =
    data.income.every((v) => v !== null) &&
    data.budget.bills.some((b) => b.essential) &&
    harvest !== null &&
    harvest.surplus >= 0;
  const cushionReady = data.emergency.amount >= data.emergency.target;
  const goals = data.jars.filter((j) => !j.archived);
  const goalReady = goals.some((j) => j.target !== null && j.target > 0);
  const ready = [cashReady, seasonalReady, cushionReady, goalReady].filter(Boolean).length;
  const snapshot: CheckIn = {
    date: today,
    ready,
    cashLowest: forecast.lowest,
    emergency: data.emergency.amount,
    goalSaved: goals.reduce((s, j) => s + j.amount, 0),
    debt: data.debts.reduce((s, d) => s + d.balance, 0),
  };
  return {
    forecast,
    harvest,
    started,
    cashReady,
    seasonalReady,
    cushionReady,
    goalReady,
    ready,
    snapshot,
  };
}
export function saveCheckIn(history: CheckIn[], entry: CheckIn) {
  return [...history.filter((item) => item.date !== entry.date), entry]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-366);
}
export type CoachTopic =
  "cash" | "season" | "benefits" | "debt" | "spending" | "savings" | "unknown";
export function coachTopic(question: string): CoachTopic {
  const q = question
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/benefit|apple|wic|snap|ayuda|elegib/.test(q)) return "benefits";
  if (/debt|loan|apr|deuda|prestamo|interes/.test(q)) return "debt";
  if (/season|harvest|slow|temporada|cosecha|gig/.test(q)) return "season";
  if (/spend|want|cut|gasto|compra|deseo|reduc/.test(q)) return "spending";
  if (/sav|goal|cushion|ahorr|meta|fondo|quince|carro/.test(q)) return "savings";
  if (/bill|payday|cash|focus|rent|cuenta|pago|efectivo|saldo|enfoc/.test(q)) return "cash";
  return "unknown";
}
