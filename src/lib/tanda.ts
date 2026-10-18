import type { Tanda } from "./store";
import { freqDays, tandaMath } from "./finance";

export const PAYDAY_APR = 3.91;
export const CREDIT_UNION_APR = 0.18;
export const SAVINGS_APY = 0.042;

export type PositionRow = {
  position: number;
  net: number;
  role: "advance" | "savings" | "even";
  exposure: number;
  days: number;
  paydayCost: number;
  creditUnionCost: number;
  opportunityCost: number;
};

export function positionLadder(
  people: number,
  contribution: number,
  frequency: Tanda["frequency"],
): PositionRow[] {
  const step = freqDays[frequency];
  const pot = people * contribution;
  return Array.from({ length: people }, (_, i) => {
    const position = i + 1;
    const net = pot - position * contribution;
    const remaining = people - position;
    const exposure = (position - 1) * contribution;
    if (net > 0) {
      const days = remaining * step;
      const avg = net / 2;
      return {
        position,
        net,
        role: "advance" as const,
        exposure,
        days,
        paydayCost: (avg * PAYDAY_APR * days) / 365,
        creditUnionCost: (avg * CREDIT_UNION_APR * days) / 365,
        opportunityCost: 0,
      };
    }
    const days = (position - 1) * step;
    const avg = exposure / 2;
    return {
      position,
      net,
      role: net === 0 ? ("even" as const) : ("savings" as const),
      exposure,
      days,
      paydayCost: 0,
      creditUnionCost: 0,
      opportunityCost: (avg * SAVINGS_APY * days) / 365,
    };
  });
}

export type RiskLevel = "low" | "medium" | "high";

export type TandaInsights = {
  pot: number;
  exposure: number;
  netAtPayout: number;
  row: PositionRow;
  perMonth: number;
  incomeShare: number | null;
  paidSoFar: number;
  remainingToPay: number;
  daysToNext: number | null;
  daysToPayout: number | null;
  received: boolean;
  score: number;
  level: RiskLevel;
  flags: string[];
};

export function tandaInsights(t: Tanda, monthlyIncome?: number | null): TandaInsights {
  const m = tandaMath(t);
  const ladder = positionLadder(t.people, t.contribution, t.frequency);
  const position = Math.min(Math.max(t.position, 1), t.people);
  const row = ladder[position - 1];
  if (!row) throw new Error("A tanda must have at least one valid payout position.");
  const step = freqDays[t.frequency];
  const perMonth = (t.contribution * 30) / step;
  const incomeShare = monthlyIncome && monthlyIncome > 0 ? perMonth / monthlyIncome : null;
  const paidSoFar = t.paid.length * t.contribution;
  const remainingToPay = Math.max(0, (t.people - t.paid.length) * t.contribution);
  const received = t.received === true;
  const missed = t.missed ?? [];

  const now = Date.now();
  const dayMs = 86_400_000;
  const daysTo = (d: Date | null) => (d ? Math.ceil((d.getTime() - now) / dayMs) : null);

  const flags: string[] = [];
  let score = 0;
  if (t.people > 15) {
    score += 22;
    flags.push("tanda.risk.bigGroup");
  } else if (t.people > 10) {
    score += 12;
    flags.push("tanda.risk.bigGroup");
  }
  if (position / t.people > 0.7) {
    score += 20;
    flags.push("tanda.risk.latePosition");
  }
  if (incomeShare !== null && incomeShare > 0.2) {
    score += 25;
    flags.push("tanda.risk.incomeShare");
  } else if (incomeShare !== null && incomeShare > 0.1) {
    score += 12;
    flags.push("tanda.risk.incomeShare");
  }
  if (!t.startDate) {
    score += 8;
    flags.push("tanda.risk.noSchedule");
  }
  if (missed.length > 0) {
    score += 28;
    flags.push("tanda.risk.missed");
  }
  if ((t.members?.filter(Boolean).length ?? 0) < t.people) {
    score += 8;
    flags.push("tanda.risk.unknownMembers");
  }
  score = Math.min(100, score);
  const level: RiskLevel = score < 25 ? "low" : score < 55 ? "medium" : "high";

  return {
    pot: m.payout,
    exposure: row.exposure,
    netAtPayout: m.netAtPayout,
    row,
    perMonth,
    incomeShare,
    paidSoFar,
    remainingToPay,
    daysToNext: daysTo(m.nextDate),
    daysToPayout: daysTo(m.payoutDate),
    received,
    score,
    level,
    flags,
  };
}

function icsDate(d: Date) {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function tandaIcs(t: Tanda, labels: { contribution: string; payout: string }): string {
  const m = tandaMath(t);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Finavi//Tanda//EN",
    "CALSCALE:GREGORIAN",
  ];
  m.roundDates.forEach((d, i) => {
    if (!d) return;
    const round = i + 1;
    const mine = round === t.position;
    const end = new Date(d);
    end.setDate(end.getDate() + 1);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${t.id}-${round}@finavi.local`,
      `DTSTAMP:${icsDate(new Date())}T000000Z`,
      `DTSTART;VALUE=DATE:${icsDate(d)}`,
      `DTEND;VALUE=DATE:${icsDate(end)}`,
      `SUMMARY:${t.name} - ${mine ? labels.payout : labels.contribution} (${round}/${t.people})`,
      "END:VEVENT",
    );
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadIcs(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
