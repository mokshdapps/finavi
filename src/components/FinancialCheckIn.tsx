import { Link } from "@tanstack/react-router";
import { Check, ArrowRight, Bookmark } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { financialCheckIn, saveCheckIn } from "@/lib/financial-checkin";
import { Button, Meter, Section } from "./ui-kit";
import { BrandIcon } from "./BrandIcon";
export function FinancialCheckIn({ compact = false }: { compact?: boolean }) {
  const { data, update } = useStore();
  const { t, money, formatDate } = useI18n();
  const c = financialCheckIn(data);
  const previous = data.checkIns.filter((i) => i.date < c.snapshot.date).at(-1);
  const delta = previous ? data.emergency.amount - previous.emergency : 0;
  const todaySaved = data.checkIns.some((i) => i.date === c.snapshot.date);
  const categories = [
    {
      key: "cashCategory" as const,
      to: "/plan/week" as const,
      ready: c.cashReady,
      detail: !c.started
        ? t("feedback.missing")
        : c.forecast.lowest < 0
          ? t("feedback.gap", { amount: money(-c.forecast.lowest) })
          : t("feedback.covered"),
    },
    {
      key: "seasonCategory" as const,
      to: "/plan/budget" as const,
      ready: c.seasonalReady,
      detail: c.harvest
        ? t(c.harvest.surplus < 0 ? "feedback.short" : "feedback.room", {
            amount: money(Math.abs(c.harvest.surplus)),
          })
        : t("feedback.missing"),
    },
    {
      key: "cushionCategory" as const,
      to: "/plan/emergency" as const,
      ready: c.cushionReady,
      detail: `${money(data.emergency.amount)} / ${money(data.emergency.target)}`,
    },
    {
      key: "goalCategory" as const,
      to: "/goals/jars" as const,
      ready: c.goalReady,
      detail: data.jars.some((j) => !j.archived)
        ? money(c.snapshot.goalSaved)
        : t("feedback.missing"),
    },
  ];
  const priorities = [
    ...(!c.started
      ? [{ key: "Start" as const, to: "/plan/week" as const }]
      : c.forecast.lowest < data.moneyPlan.protected
        ? [{ key: "Cash" as const, to: "/plan/week" as const }]
        : []),
    ...(!data.benefits ? [{ key: "Benefits" as const, to: "/plan/benefits" as const }] : []),
    ...(data.debts.length ? [{ key: "Debt" as const, to: "/plan/debt" as const }] : []),
    ...(!c.cushionReady ? [{ key: "Cushion" as const, to: "/plan/emergency" as const }] : []),
    ...(!c.goalReady ? [{ key: "Goal" as const, to: "/goals/jars" as const }] : []),
  ].slice(0, 3);
  return (
    <Section title={t("feedback.healthTitle")}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-border pt-5">
        <div className="min-w-0">
          <p className="text-xl font-semibold">
            {t("feedback.readiness", { n: c.ready, total: 4 })}
          </p>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground">
            {t("feedback.healthNote")}
          </p>
        </div>
        <BrandIcon name="sprout" className="size-12 shrink-0 text-safe" />
      </div>
      <div className="mt-4">
        <Meter value={c.ready} max={4} label={t("feedback.healthTitle")} />
      </div>
      <div className={compact ? "hidden" : "mt-4 grid gap-x-7 sm:grid-cols-2"}>
        {categories.map((item) => (
          <Link
            key={item.key}
            to={item.to}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border py-4"
          >
            <span className="min-w-0">
              <span className="block font-medium">{t(`feedback.${item.key}`)}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{item.detail}</span>
            </span>
            {item.ready ? (
              <Check className="size-5 text-safe" />
            ) : (
              <ArrowRight className="size-4 text-primary" />
            )}
          </Link>
        ))}
      </div>
      {!compact && priorities.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">{t("feedback.priorities")}</h3>
          <ol className="mt-2 divide-y divide-border">
            {priorities.map((p, i) => (
              <li key={p.key}>
                <Link to={p.to} className="flex items-start gap-3 py-3">
                  <span className="num flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm text-primary-strong">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-medium">{t(`feedback.priority${p.key}`)}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {t(`feedback.priority${p.key}Body`)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}
      <details className="mt-5 border-y border-border py-3" open={data.checkIns.length > 1}>
        <summary className="min-h-9 cursor-pointer font-medium">
          {t("feedback.progressTitle")}
        </summary>
        {previous && (
          <p className="mt-3 text-sm text-safe">
            {t(
              delta > 0
                ? "feedback.progressUp"
                : delta < 0
                  ? "feedback.progressDown"
                  : "feedback.progressSame",
              { amount: money(Math.abs(delta)) },
            )}
          </p>
        )}
        {!data.checkIns.length ? (
          <p className="mt-3 text-sm text-muted-foreground">{t("feedback.progressEmpty")}</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {data.checkIns
              .slice(-8)
              .reverse()
              .map((item) => (
                <li
                  key={item.date}
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-3 text-sm"
                >
                  <span>
                    {formatDate(`${item.date}T12:00:00`)}
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {t("feedback.readiness", { n: item.ready, total: 4 })}
                    </span>
                  </span>
                  <span className="num">
                    {money(item.emergency)}
                    <span className="block text-xs text-muted-foreground">
                      {t("feedback.cushionCategory")}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {t("feedback.goalCategory")}: {money(item.goalSaved)}
                    </span>
                    {item.debt > 0 && (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {t("connected.balance")}: {money(item.debt)}
                      </span>
                    )}
                  </span>
                </li>
              ))}
          </ul>
        )}
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {t("feedback.progressNote")}
        </p>
      </details>
      <Button
        variant="secondary"
        className="mt-4"
        onClick={() => update((d) => ({ ...d, checkIns: saveCheckIn(d.checkIns, c.snapshot) }))}
      >
        <Bookmark className="size-4" />
        {t(todaySaved ? "feedback.progressSaved" : "feedback.progressSave")}
      </Button>
    </Section>
  );
}
