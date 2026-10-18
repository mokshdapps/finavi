import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore, INITIAL_CASH } from "@/lib/store";
import { securities, investLessons } from "@/data/market";
import { PageHeader } from "@/components/AppShell";
import { Button, Field, Note, Page, Section, Stat, Stepper } from "@/components/ui-kit";

const MAX_STEP = (securities[0]?.prices.length ?? 1) - 1;

export function InvestPage() {
  const { t, lang, money } = useI18n();
  const { data, update } = useStore();
  const { cash, holdings, step } = data.invest;
  const [qty, setQty] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const priceOf = (symbol: string, at = step) =>
    securities.find((s) => s.symbol === symbol)?.prices[Math.min(at, MAX_STEP)] ?? 0;

  const holdingsValue = Object.entries(holdings).reduce((a, [sym, n]) => a + priceOf(sym) * n, 0);
  const totalValue = cash + holdingsValue;
  const change = totalValue - INITIAL_CASH;

  const n = (sym: string) => qty[sym] ?? 1;

  const buy = (sym: string) => {
    const cost = priceOf(sym) * n(sym);
    if (cost > cash) {
      setError(t("invest.notEnough"));
      return;
    }
    setError(null);
    update((d) => ({
      ...d,
      invest: {
        ...d.invest,
        cash: Math.round((d.invest.cash - cost) * 100) / 100,
        holdings: { ...d.invest.holdings, [sym]: (d.invest.holdings[sym] ?? 0) + n(sym) },
      },
    }));
  };

  const sell = (sym: string) => {
    const owned = holdings[sym] ?? 0;
    const count = Math.min(owned, n(sym));
    if (count <= 0) return;
    setError(null);
    update((d) => {
      const next = { ...d.invest.holdings, [sym]: (d.invest.holdings[sym] ?? 0) - count };
      if ((next[sym] ?? 0) <= 0) delete next[sym];
      return {
        ...d,
        invest: {
          ...d.invest,
          cash: Math.round((d.invest.cash + priceOf(sym) * count) * 100) / 100,
          holdings: next,
        },
      };
    });
  };

  return (
    <Page>
      <PageHeader title={t("invest.title")} back="/learn" />

      <Section>
        <Note tone="caution">{t("invest.banner")}</Note>
      </Section>

      <Section>
        <dl className="grid grid-cols-3 gap-4 border-y border-border py-5">
          <Stat label={t("invest.value")} value={money(totalValue)} tone="primary" />
          <Stat label={t("invest.cash")} value={money(cash)} size="sm" />
          <Stat
            label={t("invest.change")}
            value={`${change >= 0 ? "+" : "−"}${money(Math.abs(change))}`}
            tone={change >= 0 ? "safe" : "danger"}
            size="sm"
          />
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            disabled={step >= MAX_STEP}
            onClick={() =>
              update((d) => ({
                ...d,
                invest: { ...d.invest, step: Math.min(MAX_STEP, d.invest.step + 1) },
              }))
            }
          >
            {t("invest.year")}
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              update((d) => ({ ...d, invest: { cash: INITIAL_CASH, holdings: {}, step: 0 } }))
            }
          >
            {t("invest.reset")}
          </Button>
        </div>
        {step > 0 && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t("invest.yearDone")}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-2 text-sm font-medium text-danger">
            {error}
          </p>
        )}
      </Section>

      <Section title={t("invest.market")}>
        <div className="divide-y divide-border border-y border-border">
          {securities.map((s) => {
            const price = priceOf(s.symbol);
            const prev = s.prices[Math.max(0, Math.min(step, MAX_STEP) - 1)] ?? 0;
            const pct = step > 0 && prev ? ((price - prev) / prev) * 100 : 0;
            const owned = holdings[s.symbol] ?? 0;
            return (
              <article key={s.symbol} className="py-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-semibold">
                    <span className="num">{s.symbol}</span>
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      {s.name[lang]}
                    </span>
                  </h2>
                  <span className="shrink-0 text-right">
                    <span className="num block font-semibold">{money(price, true)}</span>
                    {step > 0 && (
                      <span
                        className={`num block text-xs ${pct >= 0 ? "text-safe" : "text-danger"}`}
                      >
                        {pct >= 0 ? "+" : ""}
                        {pct.toFixed(1)}%
                      </span>
                    )}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {s.note[lang]}
                </p>

                <ul className="mt-3 flex h-10 items-end gap-1" aria-hidden>
                  {s.prices.slice(0, step + 1).map((p, i) => (
                    <li
                      key={i}
                      className="w-2 rounded-t-sm bg-primary/60"
                      style={{ height: `${(p / Math.max(...s.prices)) * 100}%` }}
                    />
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-end gap-2">
                  <div className="w-36">
                    <Field label={t("invest.qty")} htmlFor={`q-${s.symbol}`}>
                      <Stepper
                        id={`q-${s.symbol}`}
                        label={`${t("invest.qty")} ${s.symbol}`}
                        value={n(s.symbol)}
                        min={1}
                        max={99}
                        onChange={(v) => setQty((q) => ({ ...q, [s.symbol]: v }))}
                      />
                    </Field>
                  </div>
                  <Button size="md" onClick={() => buy(s.symbol)}>
                    {t("invest.buy")}
                  </Button>
                  <Button
                    size="md"
                    variant="secondary"
                    disabled={owned <= 0}
                    onClick={() => sell(s.symbol)}
                  >
                    {t("invest.sell")}
                  </Button>
                  {owned > 0 && (
                    <span className="num pb-3 text-sm text-muted-foreground">
                      {owned} {t("invest.shares")} · {money(owned * price)}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section title={t("invest.holdings")}>
        {Object.keys(holdings).length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("invest.noHoldings")}</p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {Object.entries(holdings).map(([sym, count]) => (
              <li key={sym} className="flex items-center justify-between gap-3 py-3">
                <span className="num font-medium">
                  {sym} · {count} {t("invest.shares")}
                </span>
                <span className="num font-semibold">{money(priceOf(sym) * count)}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={t("invest.lesson")}>
        <ul className="space-y-2.5 border-y border-border py-5">
          {investLessons.map((l) => (
            <li key={l.id} className="flex gap-3 text-sm leading-relaxed">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{l[lang]}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Note tone="neutral">{t("common.disclaimer")}</Note>
      </Section>
    </Page>
  );
}
