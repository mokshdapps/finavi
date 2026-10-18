import { Link } from "@tanstack/react-router";
import { Plus, ShieldCheck, CalendarClock, ArrowRight } from "lucide-react";
import { BrandIcon } from "@/components/BrandIcon";
import { useI18n } from "@/lib/i18n";
import type { TKey } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { buildBudget, tandaMath } from "@/lib/finance";
import { tandaInsights } from "@/lib/tanda";
import { PageHeader } from "@/components/AppShell";
import { Button, EmptyState, Meter, Note, Page, Section, Stat } from "@/components/ui-kit";

export function TandasHub() {
  const { t, money } = useI18n();
  const { data } = useStore();
  const monthly = buildBudget(data.income)?.target ?? null;

  const rows = data.tandas.map((tanda) => ({
    tanda,
    m: tandaMath(tanda),
    ins: tandaInsights(tanda, monthly),
  }));

  const totalPot = rows.reduce((a, r) => a + (r.ins.received ? 0 : r.ins.pot), 0);
  const totalExposure = rows.reduce((a, r) => a + (r.ins.received ? 0 : r.ins.paidSoFar), 0);
  const perMonth = rows.reduce((a, r) => a + r.ins.perMonth, 0);

  const next = rows
    .filter((r) => r.ins.daysToNext !== null)
    .sort((a, b) => (a.ins.daysToNext ?? 0) - (b.ins.daysToNext ?? 0))[0];

  return (
    <Page>
      <PageHeader
        title={t("tanda.hub")}
        intro={t("feedback.tandaExplain")}
        back="/"
        right={
          <Button asChild size="sm">
            <Link to="/tandas/new">
              <Plus className="size-4" /> {t("feedback.tandaOneAction")}
            </Link>
          </Button>
        }
      />

      <div className="mt-6 border-y border-border py-4">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-primary-strong">{t("feedback.tandaPersonal")}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t("feedback.tandaExplain")}
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <Section>
          <EmptyState title={t("tanda.emptyTitle")} body={t("tanda.emptyBody")} />
        </Section>
      ) : (
        <>
          <Section title={t("tanda.overview")}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-5 sm:grid-cols-3">
              <Stat label={t("tanda.totalPot")} value={money(totalPot)} tone="primary" />
              <Stat
                label={t("tanda.totalExposure")}
                value={money(Math.max(0, totalExposure))}
                size="sm"
              />
              <Stat label={t("tanda.perMonth")} value={money(Math.round(perMonth))} size="sm" />
            </dl>
            {next && (
              <p className="num mt-4 flex items-center gap-2 text-[0.95rem] font-medium">
                <CalendarClock className="size-4 text-primary" aria-hidden />
                {next.tanda.name}: {money(next.tanda.contribution)} ·{" "}
                {(next.ins.daysToNext ?? 0) < 0
                  ? t("tanda.overdue", { n: Math.abs(next.ins.daysToNext ?? 0) })
                  : (next.ins.daysToNext ?? 0) === 0
                    ? t("tanda.dueToday")
                    : t("tanda.dueIn", { n: next.ins.daysToNext ?? 0 })}
              </p>
            )}
          </Section>

          <Section title={t("tanda.circles")} description={t("tanda.tracked", { n: rows.length })}>
            <ul className="divide-y divide-border border-y border-border">
              {rows.map(({ tanda, m, ins }) => (
                <li key={tanda.id}>
                  <Link
                    to="/tandas/$id"
                    params={{ id: tanda.id }}
                    className="block py-4 transition-colors hover:bg-muted/60"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2 font-medium">
                        <BrandIcon name="circle" className="size-5 shrink-0 text-primary-strong" />
                        <span className="truncate">{tanda.name}</span>
                      </span>
                      <span className="num shrink-0 text-[0.95rem] font-semibold">
                        {money(ins.pot)}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <Meter
                        value={tanda.paid.length}
                        max={m.rounds}
                        label={tanda.name}
                        tone={tanda.paid.length >= m.rounds ? "safe" : "primary"}
                      />
                    </div>
                    <p className="num mt-2 text-sm text-muted-foreground">
                      {t("tanda.progress", { paid: tanda.paid.length, total: m.rounds })} ·{" "}
                      {t("tanda.round")} {tanda.position} · {t(`tanda.risk.${ins.level}` as TKey)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}

      <Section title={t("tanda.safety")}>
        <ul className="space-y-2.5 border-y border-border py-5">
          {["1", "2", "3", "4", "5", "6"].map((n) => (
            <li key={n} className="flex gap-3 text-sm leading-relaxed">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>{t(`tanda.safety.${n}` as TKey)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Note tone="info">{t("tanda.noInterest")}</Note>
        </div>
        <Link
          to="/learn/tandas"
          className="mt-4 inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-strong"
        >
          {t("learn.tanda")} <ArrowRight className="size-4" />
        </Link>
      </Section>
    </Page>
  );
}
