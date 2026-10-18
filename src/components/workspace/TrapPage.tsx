import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore, uid, type TrapMode } from "@/lib/store";
import {
  amortPayment,
  comparisonCost,
  computeApr,
  impliedApr,
  payoffSchedule,
  periodInDays,
  riskLevel,
} from "@/lib/finance";
import { trapReference } from "@/data/learn";
import { PageHeader } from "@/components/AppShell";
import {
  Button,
  Field,
  MoneyInput,
  Note,
  Page,
  PercentInput,
  Section,
  Segmented,
  Stepper,
} from "@/components/ui-kit";

type Unit = "days" | "weeks" | "months";
type Freq = "weekly" | "biweekly" | "monthly";

const FREQ_DAYS: Record<Freq, number> = { weekly: 7, biweekly: 14, monthly: 30.4375 };
const FREQ_PER_YEAR: Record<Freq, number> = { weekly: 52, biweekly: 26, monthly: 12 };

type Result = {
  apr: number;
  received: number;
  repay: number;
  cost: number;
  days: number;
  comparison: number;
  extras: { label: string; value: string; tone?: "danger" | "muted" }[];
  footnote?: string;
};

export function TrapPage() {
  const { t, lang, money, formatDate } = useI18n();
  const { data, update } = useStore();

  const [mode, setMode] = useState<TrapMode | null>(null);
  const [saved, setSaved] = useState(false);

  const [received, setReceived] = useState<number | null>(300);
  const [fee, setFee] = useState<number | null>(45);
  const [period, setPeriod] = useState(14);
  const [unit, setUnit] = useState<Unit>("days");
  const [rollovers, setRollovers] = useState(0);

  const [principal, setPrincipal] = useState<number | null>(2000);
  const [rate, setRate] = useState<number | null>(89);
  const [term, setTerm] = useState(12);
  const [addedFees, setAddedFees] = useState<number | null>(150);

  const [balance, setBalance] = useState<number | null>(1500);
  const [cardRate, setCardRate] = useState<number | null>(27.9);
  const [monthly, setMonthly] = useState<number | null>(60);

  const [cashPrice, setCashPrice] = useState<number | null>(600);
  const [payAmount, setPayAmount] = useState<number | null>(45);
  const [payCount, setPayCount] = useState(26);
  const [freq, setFreq] = useState<Freq>("biweekly");

  const num = (n: number, digits = 1) =>
    n >= 1000
      ? Math.round(n).toLocaleString(lang === "es" ? "es-US" : "en-US")
      : n.toFixed(digits).replace(/\.0$/, "");

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (mode === "flat") {
      if (received !== null && received <= 0) e["received"] = t("common.mustBePositive");
      if (fee !== null && fee <= 0) e["fee"] = t("common.mustBePositive");
    }
    if (mode === "installment") {
      if (principal !== null && principal <= 0) e["principal"] = t("common.mustBePositive");
      if (rate !== null && rate < 0) e["rate"] = t("trap.errRate");
    }
    if (mode === "revolving") {
      if (balance !== null && balance <= 0) e["balance"] = t("common.mustBePositive");
      if (monthly !== null && monthly <= 0) e["monthly"] = t("trap.errPayment");
      if (balance && cardRate !== null && monthly && monthly <= (balance * (cardRate / 100)) / 12)
        e["monthly"] = t("trap.errNeverPays");
    }
    if (mode === "rentown") {
      if (cashPrice !== null && cashPrice <= 0) e["cashPrice"] = t("common.mustBePositive");
      if (payAmount !== null && payAmount <= 0) e["payAmount"] = t("trap.errPayment");
      if (cashPrice && payAmount && payAmount * payCount <= cashPrice)
        e["payAmount"] = t("trap.errPrice");
    }
    return e;
  }, [
    mode,
    received,
    fee,
    principal,
    rate,
    balance,
    cardRate,
    monthly,
    cashPrice,
    payAmount,
    payCount,
    t,
  ]);

  const result: Result | null = useMemo(() => {
    if (Object.keys(errors).length > 0) return null;

    if (mode === "flat") {
      if (!received || !fee) return null;
      const days = periodInDays(period, unit);
      const apr = computeApr(received, received + fee, days);
      const cycles = rollovers + 1;
      const totalFees = fee * cycles;
      const totalDays = days * cycles;
      return {
        apr,
        received,
        repay: received + totalFees,
        cost: totalFees,
        days: totalDays,
        comparison: comparisonCost(received, totalDays),
        extras:
          rollovers > 0
            ? [
                {
                  label: t("trap.rollTotal", { n: String(rollovers) }),
                  value: money(totalFees),
                  tone: "danger",
                },
              ]
            : [],
        ...(rollovers > 0
          ? {
              footnote: t("trap.rollWarn", {
                n: String(rollovers),
                amount: money(totalFees),
                principal: money(received),
              }),
            }
          : {}),
      };
    }

    if (mode === "installment") {
      if (!principal || rate === null) return null;
      const financed = principal + (addedFees ?? 0);
      const payment = amortPayment(financed, rate, term);
      const repay = payment * term;
      const apr = impliedApr(principal, payment, term, 12);
      const days = term * 30.4375;
      return {
        apr,
        received: principal,
        repay,
        cost: repay - principal,
        days,
        comparison: comparisonCost(principal, days),
        extras: [{ label: t("trap.monthlyPayment"), value: money(payment) }],
        ...(addedFees && addedFees > 0
          ? { footnote: t("trap.statedVsReal", { stated: num(rate), real: num(apr) }) }
          : {}),
      };
    }

    if (mode === "revolving") {
      if (!balance || cardRate === null || !monthly) return null;
      const p = payoffSchedule(balance, cardRate, monthly);
      if (p.never) return null;
      const days = p.months * 30.4375;
      return {
        apr: cardRate,
        received: balance,
        repay: p.total,
        cost: p.interest,
        days,
        comparison: comparisonCost(balance, days),
        extras: [
          { label: t("trap.payoffTime"), value: t("trap.monthsValue", { n: String(p.months) }) },
          { label: t("trap.interestTotal"), value: money(p.interest), tone: "danger" },
        ],
      };
    }

    if (mode === "rentown") {
      if (!cashPrice || !payAmount) return null;
      const repay = payAmount * payCount;
      const perYear = FREQ_PER_YEAR[freq];
      const apr = impliedApr(cashPrice, payAmount, payCount, perYear);
      const days = payCount * FREQ_DAYS[freq];
      return {
        apr,
        received: cashPrice,
        repay,
        cost: repay - cashPrice,
        days,
        comparison: comparisonCost(cashPrice, days),
        extras: [
          {
            label: t("trap.markup"),
            value: `${num((repay / cashPrice - 1) * 100, 0)}%`,
            tone: "danger",
          },
        ],
      };
    }

    return null;
  }, [
    mode,
    errors,
    received,
    fee,
    period,
    unit,
    rollovers,
    principal,
    rate,
    term,
    addedFees,
    balance,
    cardRate,
    monthly,
    cashPrice,
    payAmount,
    payCount,
    freq,
    money,
    t,
  ]);

  const risk = result ? riskLevel(result.apr) : null;
  const tone =
    risk === "high"
      ? { text: "text-danger", border: "border-danger" }
      : risk === "med"
        ? { text: "text-caution", border: "border-caution" }
        : { text: "text-safe", border: "border-safe" };

  const saveCheck = () => {
    if (!result || !mode) return;
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    update((d) => ({
      ...d,
      trapChecks: [
        {
          id: uid(),
          received: Math.round(result.received),
          repay: Math.round(result.repay),
          period: Math.round(result.days),
          unit: "days" as const,
          apr: Math.round(result.apr),
          date: new Date().toISOString(),
          mode,
        },
        ...d.trapChecks,
      ].slice(0, 12),
    }));
  };

  const MODES: { value: TrapMode; title: string; desc: string }[] = [
    { value: "flat", title: t("trap.mode.flat"), desc: t("trap.mode.flatDesc") },
    {
      value: "installment",
      title: t("trap.mode.installment"),
      desc: t("trap.mode.installmentDesc"),
    },
    { value: "revolving", title: t("trap.mode.revolving"), desc: t("trap.mode.revolvingDesc") },
    { value: "rentown", title: t("trap.mode.rentown"), desc: t("trap.mode.rentownDesc") },
  ];

  return (
    <Page>
      <PageHeader title={t("trap.title")} intro={t("trap.intro")} back="/plan" />

      {mode === null ? (
        <Section title={t("trap.mode.title")}>
          <p className="mb-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
            {t("trap.mode.help")}
          </p>
          <ul className="divide-y divide-border border-y border-border">
            {MODES.map((m) => (
              <li key={m.value}>
                <button
                  type="button"
                  onClick={() => setMode(m.value)}
                  className="group w-full px-1 py-4 text-left transition-colors hover:bg-primary-soft/50"
                >
                  <span className="block font-semibold group-hover:text-primary-strong">
                    {m.title}
                  </span>
                  <span className="mt-1 block max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {m.desc}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <>
          <Section>
            <button
              type="button"
              onClick={() => setMode(null)}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden />
              {t("trap.mode.change")}
            </button>
            <h2 className="mt-1 text-lg leading-snug font-semibold">
              {MODES.find((m) => m.value === mode)?.title}
            </h2>
          </Section>

          <Section>
            <div className="space-y-5">
              {mode === "flat" && (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={t("trap.received")} htmlFor="received" error={errors["received"]}>
                      <MoneyInput
                        id="received"
                        value={received}
                        aria-invalid={!!errors["received"]}
                        onValueChange={setReceived}
                      />
                    </Field>
                    <Field
                      label={t("trap.fee")}
                      hint={t("trap.feeHint")}
                      htmlFor="fee"
                      error={errors["fee"]}
                    >
                      <MoneyInput
                        id="fee"
                        value={fee}
                        aria-invalid={!!errors["fee"]}
                        onValueChange={setFee}
                      />
                    </Field>
                  </div>
                  <Field label={t("trap.dueIn")} htmlFor="period">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="sm:w-40">
                        <Stepper
                          id="period"
                          label={t("trap.dueIn")}
                          value={period}
                          min={1}
                          max={365}
                          onChange={setPeriod}
                        />
                      </div>
                      <div className="sm:flex-1">
                        <Segmented<Unit>
                          label={t("trap.dueIn")}
                          value={unit}
                          onChange={setUnit}
                          options={[
                            { value: "days", label: t("trap.unit.days") },
                            { value: "weeks", label: t("trap.unit.weeks") },
                            { value: "months", label: t("trap.unit.months") },
                          ]}
                        />
                      </div>
                    </div>
                  </Field>
                  <div className="sm:max-w-xs">
                    <Field label={t("trap.rollovers")} hint={t("trap.rolloverHint")} htmlFor="roll">
                      <Stepper
                        id="roll"
                        label={t("trap.rollovers")}
                        value={rollovers}
                        min={0}
                        max={24}
                        onChange={setRollovers}
                      />
                    </Field>
                  </div>
                </>
              )}

              {mode === "installment" && (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label={t("trap.principal")}
                      htmlFor="principal"
                      error={errors["principal"]}
                    >
                      <MoneyInput
                        id="principal"
                        value={principal}
                        aria-invalid={!!errors["principal"]}
                        onValueChange={setPrincipal}
                      />
                    </Field>
                    <Field label={t("trap.statedRate")} htmlFor="rate" error={errors["rate"]}>
                      <PercentInput
                        id="rate"
                        value={rate}
                        aria-invalid={!!errors["rate"]}
                        onValueChange={setRate}
                      />
                    </Field>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={t("trap.term")} htmlFor="term">
                      <Stepper
                        id="term"
                        label={t("trap.term")}
                        value={term}
                        min={1}
                        max={120}
                        onChange={setTerm}
                      />
                    </Field>
                    <Field
                      label={`${t("trap.addedFees")} (${t("common.optional")})`}
                      htmlFor="addedFees"
                    >
                      <MoneyInput id="addedFees" value={addedFees} onValueChange={setAddedFees} />
                    </Field>
                  </div>
                </>
              )}

              {mode === "revolving" && (
                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label={t("trap.balance")} htmlFor="balance" error={errors["balance"]}>
                    <MoneyInput
                      id="balance"
                      value={balance}
                      aria-invalid={!!errors["balance"]}
                      onValueChange={setBalance}
                    />
                  </Field>
                  <Field label={t("trap.cardRate")} htmlFor="cardRate">
                    <PercentInput id="cardRate" value={cardRate} onValueChange={setCardRate} />
                  </Field>
                  <Field label={t("trap.payment")} htmlFor="monthly" error={errors["monthly"]}>
                    <MoneyInput
                      id="monthly"
                      value={monthly}
                      aria-invalid={!!errors["monthly"]}
                      onValueChange={setMonthly}
                    />
                  </Field>
                </div>
              )}

              {mode === "rentown" && (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label={t("trap.cashPrice")}
                      htmlFor="cashPrice"
                      error={errors["cashPrice"]}
                    >
                      <MoneyInput
                        id="cashPrice"
                        value={cashPrice}
                        aria-invalid={!!errors["cashPrice"]}
                        onValueChange={setCashPrice}
                      />
                    </Field>
                    <Field
                      label={t("trap.paymentAmount")}
                      htmlFor="payAmount"
                      error={errors["payAmount"]}
                    >
                      <MoneyInput
                        id="payAmount"
                        value={payAmount}
                        aria-invalid={!!errors["payAmount"]}
                        onValueChange={setPayAmount}
                      />
                    </Field>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={t("trap.paymentCount")} htmlFor="payCount">
                      <Stepper
                        id="payCount"
                        label={t("trap.paymentCount")}
                        value={payCount}
                        min={2}
                        max={156}
                        onChange={setPayCount}
                      />
                    </Field>
                    <Field label={t("trap.frequency")} htmlFor="freq">
                      <Segmented<Freq>
                        label={t("trap.frequency")}
                        value={freq}
                        onChange={setFreq}
                        options={[
                          { value: "weekly", label: t("trap.freq.weekly") },
                          { value: "biweekly", label: t("trap.freq.biweekly") },
                          { value: "monthly", label: t("trap.freq.monthly") },
                        ]}
                      />
                    </Field>
                  </div>
                </>
              )}
            </div>
          </Section>

          {mode === "revolving" && errors["monthly"] === t("trap.errNeverPays") && (
            <Section>
              <Note tone="danger">{t("trap.never")}</Note>
            </Section>
          )}

          {result && risk && (
            <>
              <Section>
                <div className={`border-y-2 py-6 ${tone.border}`}>
                  <p className="text-[0.78rem] font-semibold tracking-[0.09em] text-muted-foreground uppercase">
                    {t("trap.apr")}
                  </p>
                  <p
                    className={`num mt-2 text-5xl leading-none font-bold tracking-tight ${tone.text}`}
                  >
                    {num(result.apr)}%
                  </p>
                  <p className={`mt-3 font-semibold ${tone.text}`}>{t(`trap.risk.${risk}`)}</p>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {mode === "flat" || risk === "low"
                      ? t(`trap.risk.${risk}.why`)
                      : t(`trap.risk.${risk}.whyLong`)}
                  </p>
                </div>
                <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground">
                  {t("trap.aprNote")}
                </p>
              </Section>

              <Section>
                <dl className="divide-y divide-border border-y border-border">
                  <Row label={t("trap.youReceive")} value={money(result.received)} />
                  {result.extras.map((x) => (
                    <Row
                      key={x.label}
                      label={x.label}
                      value={x.value}
                      danger={x.tone === "danger"}
                    />
                  ))}
                  <Row label={t("trap.youRepay")} value={money(result.repay)} strong />
                  <Row label={t("trap.cost")} value={money(result.cost)} danger />
                </dl>
                {result.footnote && (
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-danger">
                    {result.footnote}
                  </p>
                )}
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {t("trap.compare", {
                    amount: money(result.received),
                    cost: money(Math.round(result.comparison)),
                  })}
                </p>
                <p className="num mt-1.5 text-sm font-semibold">
                  {t("trap.saved", {
                    amount: money(Math.max(0, Math.round(result.cost - result.comparison))),
                  })}
                </p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={saveCheck}>
                  {saved ? (
                    <>
                      <Check className="size-4" aria-hidden />
                      {t("common.done")}
                    </>
                  ) : (
                    t("trap.save")
                  )}
                </Button>
              </Section>
            </>
          )}
        </>
      )}

      {data.trapChecks.length > 0 && (
        <Section title={t("trap.history")}>
          <ul className="divide-y divide-border border-y border-border">
            {data.trapChecks.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <span className="num text-sm">
                  {money(c.received)} → {money(c.repay)}
                  <span className="ml-2 text-muted-foreground">{formatDate(c.date)}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={`num text-sm font-semibold ${
                      riskLevel(c.apr) === "high"
                        ? "text-danger"
                        : riskLevel(c.apr) === "med"
                          ? "text-caution"
                          : "text-safe"
                    }`}
                  >
                    {c.apr}%
                  </span>
                  <button
                    type="button"
                    aria-label={`${t("common.delete")} ${c.apr}%`}
                    onClick={() =>
                      update((d) => ({
                        ...d,
                        trapChecks: d.trapChecks.filter((x) => x.id !== c.id),
                      }))
                    }
                    className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title={t("feedback.debtOrder")}>
        <Button asChild variant="secondary">
          <Link to="/plan/debt">{t("connected.debt")}</Link>
        </Button>
        <Button asChild variant="ghost" className="ml-2">
          <Link to="/goals/spending">{t("feedback.spendingTitle")}</Link>
        </Button>
      </Section>
      <Section title={t("trap.reference")}>
        <div className="divide-y divide-border border-y border-border">
          {trapReference.map((r) => (
            <article key={r.id} className="py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold">{r.title[lang]}</h3>
                <span className="num text-sm font-medium text-danger">{r.typical[lang]}</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.body[lang]}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <Note tone="neutral">{t("common.disclaimer")}</Note>
      </Section>
    </Page>
  );
}

function Row({
  label,
  value,
  strong,
  danger,
}: {
  label: string;
  value: string;
  strong?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3.5">
      <dt className="text-[0.95rem] text-muted-foreground">{label}</dt>
      <dd
        className={[
          "num shrink-0 tabular-nums",
          strong ? "text-lg font-bold" : "font-semibold",
          danger ? "text-danger" : "",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}
