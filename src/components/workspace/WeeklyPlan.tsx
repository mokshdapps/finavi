import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Check, Plus, Printer, Trash2, Undo2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore, uid } from "@/lib/store";
import { cashForecast, completeCashEvent, localDay, type CashEvent } from "@/lib/money-plan";
import { validCalendarDay } from "@/lib/plan-connections";
import { PlanConnections } from "@/components/PlanConnections";
import { PageHeader } from "@/components/AppShell";
import {
  Button,
  EmptyState,
  Field,
  MoneyInput,
  Note,
  Page,
  Section,
  Segmented,
  Stat,
  TextInput,
} from "@/components/ui-kit";

export function WeeklyPlan() {
  const { t, money, formatDate } = useI18n();
  const { data, update } = useStore();
  const plan = data.moneyPlan;
  const forecast = cashForecast(plan);
  const [kind, setKind] = useState<CashEvent["kind"]>("bill");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [date, setDate] = useState(localDay());
  const [error, setError] = useState(false);
  const patch = (next: Partial<typeof plan>) =>
    update((d) => ({ ...d, moneyPlan: { ...d.moneyPlan, ...next } }));
  const displayDate = (day: string) => formatDate(`${day}T12:00:00`);
  return (
    <Page>
      <PageHeader
        title={t("upgrade.week")}
        intro={t("upgrade.weekSub")}
        back="/plan"
        right={
          <Button
            variant="ghost"
            onClick={() => window.print()}
            aria-label={t("upgrade.print")}
            title={t("upgrade.print")}
            className="print:hidden"
          >
            <Printer className="size-5" />
          </Button>
        }
      />
      <section className="mt-7 grid gap-5 border-y border-border py-5 sm:grid-cols-3">
        <Field label={t("upgrade.balance")} htmlFor="cash">
          <MoneyInput id="cash" value={plan.cash} onValueChange={(v) => patch({ cash: v ?? 0 })} />
        </Field>
        <Field label={t("upgrade.protected")} htmlFor="protected">
          <MoneyInput
            id="protected"
            value={plan.protected}
            onValueChange={(v) => patch({ protected: v ?? 0 })}
          />
        </Field>
        <Field label={t("upgrade.horizon")}>
          <Segmented
            label={t("upgrade.horizon")}
            value={plan.days}
            onChange={(v) => patch({ days: v })}
            options={[7, 14, 30].map((n) => ({ value: n, label: t("upgrade.days", { n }) }))}
          />
        </Field>
      </section>
      <section className="mt-6 border-b border-border pb-6" aria-live="polite">
        <p className="text-sm font-medium text-muted-foreground">{t("upgrade.safe")}</p>
        <p className="num mt-2 text-5xl font-semibold text-primary-strong">
          {money(forecast.safe)}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
          <Stat
            label={t("upgrade.lowest")}
            value={money(forecast.lowest)}
            tone={forecast.lowest < 0 ? "danger" : "default"}
            size="sm"
          />
          <Stat label={t("upgrade.end")} value={money(forecast.end)} size="sm" />
          <Stat
            label={t("upgrade.incoming")}
            value={money(forecast.income)}
            size="sm"
            tone="safe"
          />
          <Stat label={t("upgrade.outgoing")} value={money(forecast.bills)} size="sm" />
        </dl>
        <div className="mt-5">
          <Note
            tone={
              forecast.lowest < 0 ? "danger" : forecast.lowest < plan.protected ? "caution" : "safe"
            }
          >
            {forecast.lowest < 0
              ? t("upgrade.gap", {
                  amount: money(-forecast.lowest),
                  date: displayDate(forecast.gapDate),
                })
              : forecast.lowest < plan.protected
                ? t("upgrade.protectedWarn", { amount: money(plan.protected - forecast.lowest) })
                : t("upgrade.covered")}
          </Note>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {t("upgrade.estimates")}
        </p>
      </section>
      <Section title={t("upgrade.addEvent")} className="print:hidden">
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!label.trim() || !amount || amount <= 0 || !validCalendarDay(date)) {
              setError(true);
              return;
            }
            patch({
              events: [
                ...plan.events,
                { id: uid(), label: label.trim(), amount, date, kind, done: false },
              ],
            });
            setLabel("");
            setAmount(null);
            setError(false);
          }}
        >
          <Segmented
            label={t("upgrade.type")}
            value={kind}
            onChange={setKind}
            options={[
              { value: "bill", label: t("upgrade.bill") },
              { value: "income", label: t("upgrade.income") },
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t("upgrade.label")} htmlFor="event-label">
              <TextInput
                id="event-label"
                maxLength={100}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
              />
            </Field>
            <Field label={t("common.amount")} htmlFor="event-amount">
              <MoneyInput id="event-amount" value={amount} onValueChange={setAmount} required />
            </Field>
            <Field label={t("upgrade.date")} htmlFor="event-date">
              <TextInput
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Field>
          </div>
          {error && (
            <p role="alert" className="text-sm text-danger">
              {t("upgrade.nameRequired")}
            </p>
          )}
          <Button type="submit" className="justify-self-start">
            <Plus className="size-4" />
            {t("upgrade.addEvent")}
          </Button>
        </form>
      </Section>
      <PlanConnections />
      <Section title={t("upgrade.timeline")}>
        {!plan.events.length ? (
          <EmptyState title={t("upgrade.noEvents")} body={t("upgrade.noEventsBody")} />
        ) : (
          <>
            <ol className="divide-y divide-border border-y border-border">
              {[...plan.events]
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((event) => {
                  const row = forecast.rows.find((r) => r.id === event.id);
                  return (
                    <li
                      key={event.id}
                      className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-4 sm:grid-cols-[36px_minmax(0,1fr)_auto_auto]"
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${event.kind === "income" ? "bg-safe-soft text-safe" : "bg-primary-soft text-primary-strong"}`}
                      >
                        {event.kind === "income" ? (
                          <ArrowDownLeft className="size-5" />
                        ) : (
                          <ArrowUpRight className="size-5" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`break-words font-medium ${event.done ? "text-muted-foreground line-through" : ""}`}
                        >
                          {event.label}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {displayDate(event.date)} ·{" "}
                          {t(event.done ? "upgrade.done" : "upgrade.due")}
                        </p>
                      </div>
                      <div className="col-start-2 min-w-0 sm:col-start-auto sm:text-right">
                        <p className="num font-semibold">
                          {event.kind === "income" ? "+" : "−"}
                          {money(event.amount)}
                        </p>
                        {row && (
                          <p
                            className={`num mt-0.5 text-xs ${row.balance < 0 ? "text-danger" : "text-muted-foreground"}`}
                          >
                            {t("upgrade.daily")}: {money(row.balance)}
                          </p>
                        )}
                      </div>
                      <div className="col-start-2 flex gap-1 print:hidden sm:col-start-auto">
                        <Button
                          variant="ghost"
                          className="size-10 px-0"
                          aria-label={`${t(event.done ? "upgrade.undo" : "upgrade.markDone")} ${event.label}`}
                          title={t(event.done ? "upgrade.undo" : "upgrade.markDone")}
                          onClick={() =>
                            update((d) => ({
                              ...d,
                              moneyPlan: completeCashEvent(d.moneyPlan, event.id),
                            }))
                          }
                        >
                          {event.done ? <Undo2 className="size-4" /> : <Check className="size-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          className="size-10 px-0 text-muted-foreground hover:text-danger"
                          aria-label={`${t("common.delete")} ${event.label}`}
                          title={t("common.delete")}
                          onClick={() =>
                            patch({ events: plan.events.filter((e) => e.id !== event.id) })
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
            </ol>
            <p className="mt-3 text-xs text-muted-foreground">{t("upgrade.doneHelp")}</p>
          </>
        )}
      </Section>
    </Page>
  );
}
