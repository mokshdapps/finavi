import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { addCommitment, planCommitments, validCalendarDay } from "@/lib/plan-connections";
import { Button, Field, Section, TextInput } from "./ui-kit";

export function PlanConnections() {
  const { data, update } = useStore();
  const { t, money } = useI18n();
  const [dates, setDates] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);
  const commitments = planCommitments(data);
  return (
    <Section
      title={t("connected.bridges")}
      description={t("connected.bridgesBody")}
      className="print:hidden"
    >
      <ul className="divide-y divide-border border-y border-border">
        {commitments.map((item) => {
          const date = dates[item.id] ?? item.date;
          return (
            <li
              key={item.id}
              className="grid min-w-0 gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_160px_auto] sm:items-end"
            >
              <div className="min-w-0">
                <p className="break-words font-medium">
                  {item.label} <span className="num text-primary-strong">{money(item.amount)}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t(item.source === "budget" ? "connected.budgetBill" : "connected.tanda")}
                </p>
              </div>
              <Field label={t("upgrade.date")} htmlFor={`date-${item.id}`}>
                <TextInput
                  id={`date-${item.id}`}
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDates((previous) => ({ ...previous, [item.id]: event.target.value }))
                  }
                />
              </Field>
              <Button
                variant="secondary"
                disabled={!validCalendarDay(date)}
                onClick={() => {
                  update((previous) => ({
                    ...previous,
                    moneyPlan: addCommitment(previous.moneyPlan, { ...item, date }),
                  }));
                  setAdded(true);
                }}
              >
                <Plus className="size-4" />
                {t("connected.add")}
              </Button>
            </li>
          );
        })}
      </ul>
      {!commitments.length && (
        <p className="py-4 text-sm text-muted-foreground">{t("connected.none")}</p>
      )}
      {added && (
        <p role="status" className="mt-3 flex items-center gap-2 text-sm text-safe">
          <Check className="size-4" />
          {t("connected.added")}
        </p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {t("connected.importNote")}
      </p>
    </Section>
  );
}
