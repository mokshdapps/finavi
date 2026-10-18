import type { AppData } from "./store";
import { tandaMath } from "./finance";
import { localDay } from "./money-plan";
export function planReminders(data: AppData, today = localDay()) {
  const end = new Date(`${today}T12:00:00`);
  end.setDate(end.getDate() + 30);
  const endDay = localDay(end);
  const bills = data.moneyPlan.events
    .filter((e) => !e.done && e.kind === "bill" && e.date <= endDay)
    .map((e) => ({
      id: e.id,
      label: e.label,
      date: e.date,
      amount: e.amount,
      kind: "bill" as const,
    }));
  const tandas = data.tandas.flatMap((t) => {
    const m = tandaMath(t);
    if (!m.nextDate || !m.nextUnpaidRound) return [];
    const date = localDay(m.nextDate);
    return date <= endDay
      ? [
          {
            id: `tanda-${t.id}-${m.nextUnpaidRound}`,
            label: t.name,
            date,
            amount: t.contribution,
            kind: "tanda" as const,
          },
        ]
      : [];
  });
  return [...bills, ...tandas].sort((a, b) => a.date.localeCompare(b.date));
}
const escape = (text: string) =>
  text.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
export function reminderCalendar(
  items: ReturnType<typeof planReminders>,
  stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Finavi//Reminders//EN",
    "CALSCALE:GREGORIAN",
  ];
  for (const item of items) {
    const end = new Date(`${item.date}T12:00:00`);
    end.setDate(end.getDate() + 1);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${escape(item.id)}@finavi.local`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${item.date.replace(/-/g, "")}`,
      `DTEND;VALUE=DATE:${localDay(end).replace(/-/g, "")}`,
      `SUMMARY:${escape(item.label)}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT12H",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escape(item.label)}`,
      "END:VALARM",
      "END:VEVENT",
    );
  }
  return [...lines, "END:VCALENDAR"].join("\r\n");
}
