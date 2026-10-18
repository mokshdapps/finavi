import { CalendarDays, Download } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { planReminders, reminderCalendar } from "@/lib/plan-reminders";
import { downloadText } from "@/lib/download";
import { Button, Section } from "./ui-kit";
export function PlanReminders() {
  const { data } = useStore();
  const { t, money, formatDate } = useI18n();
  const items = planReminders(data);
  return (
    <Section title={t("feedback.reminders")}>
      <ul className="divide-y divide-border border-y border-border">
        {items.slice(0, 5).map((item) => (
          <li key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
            <span className="min-w-0">
              <span className="flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="size-4 shrink-0 text-primary" />
                {item.label}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {formatDate(`${item.date}T12:00:00`)}
              </span>
            </span>
            <span className="num text-sm">{money(item.amount)}</span>
          </li>
        ))}
      </ul>
      {!items.length && (
        <p className="mt-3 text-sm text-muted-foreground">{t("feedback.reminderEmpty")}</p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {t("feedback.reminderNote")}
      </p>
      {!!items.length && (
        <Button
          variant="secondary"
          className="mt-3"
          onClick={() =>
            downloadText("finavi-reminders.ics", reminderCalendar(items), "text/calendar")
          }
        >
          <Download className="size-4" />
          {t("feedback.reminderExport")}
        </Button>
      )}
    </Section>
  );
}
