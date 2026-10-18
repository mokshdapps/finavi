import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore, uid } from "@/lib/store";
import type { BudgetBill } from "@/lib/store";
import { MILEAGE_RATE, buildHarvestPlan, runScenario } from "@/lib/harvest";
import type { ScenarioKind } from "@/lib/harvest";
import { monthRangeLabel } from "@/lib/finance";
import { bi, billTemplates, presetIncome, workPresets } from "@/data/harvest-presets";
import { LocalCoach } from "@/components/LocalCoach";
import { PageHeader } from "@/components/AppShell";
import {
  Button,
  EmptyState,
  Field,
  List,
  MoneyInput,
  Note,
  Page,
  PercentInput,
  Section,
  Segmented,
  Stat,
  TextInput,
  YesNo,
} from "@/components/ui-kit";

type Tab = "year" | "bills" | "plan" | "tax" | "coach";

function useBudget() {
  const { data, update } = useStore();
  const budget = data.budget;
  const income = data.income;
  const plan = useMemo(() => buildHarvestPlan(income, budget), [income, budget]);
  const setBudget = (patch: Partial<typeof budget>) =>
    update((d) => ({ ...d, budget: { ...d.budget, ...patch } }));
  return { data, update, budget, income, plan, setBudget };
}

export function BudgetPage({ initialTab = "year" }: { initialTab?: Tab }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <Page>
      <PageHeader title={t("budget.title")} intro={t("budget.intro")} back="/plan" />

      <div className="sticky top-14 z-10 -mx-1 bg-background/95 px-1 pt-4 pb-3 backdrop-blur">
        <Segmented<Tab>
          label={t("budget.title")}
          value={tab}
          onChange={setTab}
          options={[
            { value: "year", label: t("hb.tab.year") },
            { value: "bills", label: t("hb.tab.bills") },
            { value: "plan", label: t("hb.tab.plan") },
            { value: "tax", label: t("hb.tab.tax") },
            { value: "coach", label: t("hb.tab.coach") },
          ]}
        />
      </div>

      {tab === "year" && <YearTab />}
      {tab === "bills" && <BillsTab />}
      {tab === "plan" && <PlanTab onGoYear={() => setTab("year")} />}
      {tab === "tax" && <TaxTab />}
      {tab === "coach" && <CoachTab />}

      <Section>
        <Note tone="neutral">{t("common.disclaimer")}</Note>
      </Section>
    </Page>
  );
}

function YearTab() {
  const { t, money, monthName, lang } = useI18n();
  const { data, update, budget, income, plan, setBudget } = useBudget();
  const [annual, setAnnual] = useState<number | null>(28000);
  const entered = income.filter((v) => v && v > 0).length;
  const values = income.map((v) => v ?? 0);
  const best = Math.max(...values);
  const worst = Math.min(...values.filter((v) => v > 0), best);
  const max = Math.max(best, plan?.steady ?? 0, 1);

  const applyPreset = (id: string) => {
    const preset = workPresets.find((p) => p.id === id);
    if (!preset || !annual) return;
    const next = presetIncome(preset, annual);
    update((d) => ({ ...d, income: next, budget: { ...d.budget, workKind: id } }));
  };

  return (
    <>
      <Section title={t("hb.setup.title")} description={t("hb.setup.help")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("hb.setup.annual")} hint={t("hb.enteredMonths", { n: String(entered) })}>
            <MoneyInput value={annual} onValueChange={setAnnual} placeholder="28000" />
          </Field>
          <Field label={t("hb.setup.startMonth")} hint={t("hb.setup.startHelp")}>
            <select
              value={budget.startMonth}
              onChange={(e) => setBudget({ startMonth: Number(e.target.value) })}
              className="min-h-11 w-full rounded-md border border-border bg-surface px-3 text-[0.95rem]"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {monthName(i, false)}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {workPresets.map((p) => {
            const active = budget.workKind === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => applyPreset(p.id)}
                  aria-pressed={active}
                  className={`w-full rounded-md border px-4 py-3 text-left transition-colors ${
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <span className="block text-[0.95rem] font-medium">{bi(p.label, lang)}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {bi(p.note, lang)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Section>

      {plan && (
        <Section title={t("hb.year.chart")}>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-5 sm:grid-cols-4">
            <Stat label={t("hb.year.gross")} value={money(plan.gross)} />
            <Stat label={t("budget.target")} value={money(plan.steady)} tone="primary" />
            <Stat label={t("hb.year.best")} value={money(best)} size="sm" />
            <Stat label={t("hb.year.worst")} value={money(worst)} size="sm" />
          </dl>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("hb.year.swing", { x: worst > 0 ? (best / worst).toFixed(1) : "-" })}
          </p>

          <div className="relative mt-5 border-y border-border py-5">
            <ul className="flex h-44 items-end gap-1.5" aria-hidden>
              {values.map((val, i) => (
                <li key={i} className="flex h-full flex-1 flex-col justify-end">
                  <div
                    className={`w-full rounded-t-sm ${val >= plan.steady ? "bg-primary" : "bg-primary/30"}`}
                    style={{ height: `${(val / max) * 100}%` }}
                  />
                </li>
              ))}
            </ul>
            <div
              className="pointer-events-none absolute right-0 left-0 border-t border-dashed border-foreground/45"
              style={{ bottom: `calc(1.25rem + ${(plan.steady / max) * 11}rem)` }}
            >
              <span className="num absolute -top-5 right-0 bg-background pl-1 text-xs font-medium text-foreground/70">
                {money(plan.steady)}
              </span>
            </div>
            <ul className="mt-2 flex gap-1.5">
              {values.map((_, i) => (
                <li key={i} className="flex-1 text-center text-[0.6rem] text-muted-foreground">
                  {monthName(i).slice(0, 1)}
                </li>
              ))}
            </ul>
            <p className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-xs bg-primary" />
                {t("hb.year.legendPeak")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-xs bg-primary/30" />
                {t("hb.year.legendLean")}
              </span>
            </p>
          </div>
        </Section>
      )}

      <Section title={t("hb.year.title")} description={t("hb.year.help")}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {income.map((v, i) => (
            <Field key={i} label={monthName(i, false)} htmlFor={`m-${i}`}>
              <MoneyInput
                id={`m-${i}`}
                value={v}
                onValueChange={(n) =>
                  update((d) => ({
                    ...d,
                    income: d.income.map((old, idx) => (idx === i ? n : old)),
                  }))
                }
                placeholder="0"
              />
            </Field>
          ))}
        </div>
        <div className="mt-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => update((d) => ({ ...d, income: Array(12).fill(null) }))}
          >
            {t("budget.clear")}
          </Button>
        </div>
      </Section>
    </>
  );
}
function BillsTab() {
  const { t, money, monthName, lang } = useI18n();
  const { data, update, budget, income, plan, setBudget } = useBudget();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [essential, setEssential] = useState(true);

  const addBill = (b: BudgetBill) => setBudget({ bills: [...budget.bills, b] });
  const removeBill = (id: string) => setBudget({ bills: budget.bills.filter((b) => b.id !== id) });
  const patchBill = (id: string, patch: Partial<BudgetBill>) =>
    setBudget({ bills: budget.bills.map((b) => (b.id === id ? { ...b, ...patch } : b)) });

  const essentials = budget.bills.filter((b) => b.essential).reduce((a, b) => a + b.amount, 0);
  const extras = budget.bills.filter((b) => !b.essential).reduce((a, b) => a + b.amount, 0);
  const weeks = essentials > 0 ? Math.floor(budget.cashOnHand / ((essentials * 12) / 52)) : 0;

  const used = new Set(budget.bills.map((b) => b.label));

  return (
    <>
      <Section title={t("hb.bills.title")} description={t("hb.bills.help")}>
        <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {t("hb.bills.quickAdd")}
        </p>
        <div className="flex flex-wrap gap-2">
          {billTemplates
            .filter((tpl) => !used.has(bi(tpl.label, lang)))
            .map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() =>
                  addBill({
                    id: uid(),
                    label: bi(tpl.label, lang),
                    amount: tpl.typical,
                    essential: tpl.essential,
                  })
                }
                className="min-h-9 rounded-full border border-border px-3.5 text-sm transition-colors hover:border-foreground/40"
              >
                + {bi(tpl.label, lang)}
              </button>
            ))}
        </div>

        {budget.bills.length === 0 ? (
          <div className="mt-5">
            <Note tone="neutral">{t("hb.bills.empty")}</Note>
          </div>
        ) : (
          <List className="mt-5">
            {budget.bills.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="min-w-32 flex-1 text-[0.95rem]">{b.label}</span>
                <div className="w-28">
                  <MoneyInput
                    value={b.amount}
                    onValueChange={(n) => patchBill(b.id, { amount: n ?? 0 })}
                    aria-label={b.label}
                  />
                </div>
                <Segmented<"e" | "x">
                  label={b.label}
                  value={b.essential ? "e" : "x"}
                  onChange={(v) => patchBill(b.id, { essential: v === "e" })}
                  options={[
                    { value: "e", label: t("hb.bills.essential") },
                    { value: "x", label: t("hb.bills.extra") },
                  ]}
                />
                <button
                  type="button"
                  onClick={() => removeBill(b.id)}
                  aria-label={`${t("common.delete")} ${b.label}`}
                  className="min-h-9 rounded-md px-2 text-muted-foreground transition-colors hover:text-danger"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </List>
        )}

        <form
          className="mt-5 flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!label.trim() || !amount) return;
            addBill({ id: uid(), label: label.trim(), amount, essential });
            setLabel("");
            setAmount(null);
          }}
        >
          <div className="min-w-40 flex-1">
            <Field label={t("hb.bills.label")} htmlFor="bill-label">
              <TextInput id="bill-label" value={label} onChange={(e) => setLabel(e.target.value)} />
            </Field>
          </div>
          <div className="w-32">
            <Field label={t("common.amount")} htmlFor="bill-amount">
              <MoneyInput id="bill-amount" value={amount} onValueChange={setAmount} />
            </Field>
          </div>
          <Segmented<"e" | "x">
            label={t("hb.bills.label")}
            value={essential ? "e" : "x"}
            onChange={(v) => setEssential(v === "e")}
            options={[
              { value: "e", label: t("hb.bills.essential") },
              { value: "x", label: t("hb.bills.extra") },
            ]}
          />
          <Button type="submit" size="sm">
            {t("hb.bills.add")}
          </Button>
        </form>
      </Section>

      <Section>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-5 sm:grid-cols-3">
          <Stat label={t("hb.bills.survivalNumber")} value={money(essentials)} tone="primary" />
          <Stat label={t("hb.bills.extras")} value={money(extras)} size="sm" />
          <Stat label={t("common.total")} value={money(essentials + extras)} size="sm" />
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {t("hb.bills.survivalHelp")}
        </p>
      </Section>

      <Section title={t("hb.bills.cash")} description={t("hb.bills.cashHelp")}>
        <div className="max-w-xs">
          <MoneyInput
            value={budget.cashOnHand || null}
            onValueChange={(n) => setBudget({ cashOnHand: n ?? 0 })}
            aria-label={t("hb.bills.cash")}
          />
        </div>
        {essentials > 0 && budget.cashOnHand > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("hb.bills.runway", { weeks: String(weeks) })}
          </p>
        )}
      </Section>
    </>
  );
}
function PlanTab({ onGoYear }: { onGoYear: () => void }) {
  const { t, money, monthName, lang } = useI18n();
  const { data, update, budget, income, plan, setBudget } = useBudget();
  const [scenario, setScenario] = useState<ScenarioKind>("short");
  const result = useMemo(
    () => (plan ? runScenario(income, budget, scenario) : null),
    [scenario, plan],
  );

  if (!plan) {
    return (
      <Section>
        <EmptyState
          title={t("budget.emptyTitle")}
          body={t("budget.emptyBody")}
          action={
            <Button size="sm" onClick={onGoYear}>
              {t("hb.setup.custom")}
            </Button>
          }
        />
      </Section>
    );
  }

  const gap = plan.essentials - (plan.rows[0]?.paycheck ?? plan.safePaycheck);

  return (
    <>
      <Section title={t("hb.plan.title")} description={t("hb.plan.help")}>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-5 sm:grid-cols-4">
          <Stat
            label={t("hb.plan.paycheck")}
            value={money(plan.rows[0]?.paycheck ?? plan.safePaycheck)}
            tone="primary"
          />
          <Stat label={t("hb.plan.reserveNeeded")} value={money(plan.reserveNeeded)} size="sm" />
          <Stat label={t("hb.plan.peakReserve")} value={money(plan.peakReserve)} size="sm" />
          <Stat
            label={gap > 0 ? t("hb.plan.shortfall") : t("hb.plan.surplus")}
            value={money(Math.abs(gap))}
            size="sm"
            tone={gap > 0 ? "danger" : "safe"}
          />
        </dl>

        <div className="mt-4 grid gap-3">
          <Note tone={plan.feasible ? "safe" : "caution"}>
            {plan.feasible
              ? t("hb.plan.feasible", {
                  reserve: money(plan.reserveNeeded),
                  high: monthRangeLabel(plan.highMonths, (i) => monthName(i)),
                })
              : t("hb.plan.capped", {
                  steady: money(plan.steady),
                  month: monthName(plan.minBalanceMonth, false),
                  safe: money(plan.safePaycheck),
                })}
          </Note>
          {gap > 0 && <Note tone="danger">{t("hb.plan.gapWarn", { gap: money(gap) })}</Note>}
          <p className="text-sm text-muted-foreground">
            {t("hb.plan.weekly", { amount: money(plan.savePerPeakWeek) })}{" "}
            {plan.leanMonths.length > 0
              ? t("hb.plan.leanRun", { n: String(plan.longestLeanRun) })
              : t("hb.plan.noLean")}
          </p>
        </div>
      </Section>

      <Section title={t("hb.plan.ledger")}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                <th className="py-2 font-medium">{t("hb.plan.col.month")}</th>
                <th className="py-2 text-right font-medium">{t("hb.plan.col.income")}</th>
                <th className="py-2 text-right font-medium">{t("hb.plan.col.move")}</th>
                <th className="py-2 text-right font-medium">{t("hb.plan.col.reserve")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {plan.rows.map((r) => (
                <tr key={r.i}>
                  <td className="py-2.5">{monthName(r.i, false)}</td>
                  <td className="num py-2.5 text-right">{money(r.net)}</td>
                  <td
                    className={`num py-2.5 text-right font-medium ${
                      r.delta > 0
                        ? "text-safe"
                        : r.delta < 0
                          ? "text-caution"
                          : "text-muted-foreground"
                    }`}
                  >
                    {r.delta === 0 ? "-" : `${r.delta > 0 ? "+" : "−"}${money(Math.abs(r.delta))}`}
                  </td>
                  <td className={`num py-2.5 text-right ${r.short ? "text-danger" : ""}`}>
                    {money(r.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title={t("hb.scenario.title")} description={t("hb.scenario.help")}>
        <Segmented<ScenarioKind>
          label={t("hb.scenario.title")}
          value={scenario}
          onChange={setScenario}
          options={[
            { value: "short", label: t("hb.scenario.short") },
            { value: "rain", label: t("hb.scenario.rain") },
            { value: "prices", label: t("hb.scenario.prices") },
            { value: "injury", label: t("hb.scenario.injury") },
          ]}
        />
        {result && (
          <div className="mt-4 grid gap-3">
            <p className="text-[0.95rem]">
              {t("hb.scenario.result", {
                gross: money(result.gross),
                steady: money(result.steady),
              })}
            </p>
            {result.minBalance < 0 ? (
              <Note tone="caution">
                {t("hb.scenario.negative", {
                  safe: money(result.safePaycheck),
                  gap: money(result.essentialGap),
                })}
              </Note>
            ) : (
              <Note tone="safe">
                {t("hb.scenario.covered", { n: String(result.monthsCovered) })}
              </Note>
            )}
          </div>
        )}
      </Section>
    </>
  );
}
function TaxTab() {
  const { t, money, monthName, lang } = useI18n();
  const { data, update, budget, income, plan, setBudget } = useBudget();
  const quarterLabel: Record<string, string> = {
    q1: t("hb.tax.q1"),
    q2: t("hb.tax.q2"),
    q3: t("hb.tax.q3"),
    q4: t("hb.tax.q4"),
  };

  return (
    <>
      <Section title={t("hb.tax.title")} description={t("hb.tax.help")}>
        <div className="border-y border-border">
          <YesNo
            label={t("hb.tax.enable")}
            value={budget.taxEnabled}
            onChange={(v) => setBudget({ taxEnabled: v })}
            yesLabel={t("common.yes")}
            noLabel={t("common.no")}
          />
        </div>

        {!budget.taxEnabled ? (
          <p className="mt-4 text-sm text-muted-foreground">{t("hb.tax.off")}</p>
        ) : (
          <>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label={t("hb.tax.rate")} hint={t("hb.tax.rateHelp")}>
                <PercentInput
                  value={budget.taxRatePct}
                  onValueChange={(n) => setBudget({ taxRatePct: Math.min(50, n ?? 0) })}
                />
              </Field>
              <Field
                label={t("hb.tax.miles")}
                hint={t("hb.tax.milesHelp", { rate: `$${MILEAGE_RATE.toFixed(3)}` })}
              >
                <TextInput
                  inputMode="numeric"
                  value={budget.milesPerWeek === null ? "" : String(budget.milesPerWeek)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setBudget({ milesPerWeek: raw === "" ? null : Number(raw) });
                  }}
                  className="num"
                />
              </Field>
            </div>

            {plan && (
              <>
                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-5 sm:grid-cols-3">
                  <Stat label={t("hb.tax.annual")} value={money(plan.taxAnnual)} tone="primary" />
                  <Stat
                    label={t("hb.tax.deduction")}
                    value={money(plan.mileageDeduction)}
                    size="sm"
                  />
                  <Stat label={t("hb.year.gross")} value={money(plan.gross)} size="sm" />
                </dl>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t("hb.tax.monthly", {
                    amount: money(Math.round(plan.taxAnnual / 12)),
                    gross: money(Math.round(plan.gross / 12)),
                  })}
                </p>

                <h3 className="mt-7 text-sm font-semibold">{t("hb.tax.quarters")}</h3>
                <List className="mt-2">
                  {plan.quarters.map((q) => (
                    <li key={q.id} className="flex items-center justify-between gap-4 py-3">
                      <span className="text-[0.95rem]">{quarterLabel[q.id]}</span>
                      <span className="text-right">
                        <span className="num block font-semibold">{money(q.tax)}</span>
                        <span className="text-xs text-muted-foreground">{money(q.income)}</span>
                      </span>
                    </li>
                  ))}
                </List>
              </>
            )}

            <div className="mt-5">
              <Note tone="info">{t("hb.tax.note")}</Note>
            </div>
          </>
        )}
      </Section>
    </>
  );
}
function CoachTab() {
  return <LocalCoach />;
}
