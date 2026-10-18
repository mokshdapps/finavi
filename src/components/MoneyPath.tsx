import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { moneyJourney } from "@/lib/money-journey";
import { homeStages, homeTaskTitles, isFoundationTask, type HomeTaskId } from "@/data/home-tasks";
import { BrandIcon } from "./BrandIcon";
import { Button, Meter } from "./ui-kit";
import { cn } from "@/lib/utils";

export function MoneyPath({
  stageIndex,
  onStageChange,
  task,
}: {
  stageIndex: number;
  onStageChange: (index: number) => void;
  task?: HomeTaskId | undefined;
}) {
  const { t, money } = useI18n();
  const { data } = useStore();
  const model = moneyJourney(data);
  const metrics = {
    cash: data.moneyPlan.events.length
      ? t(model.forecast.lowest < 0 ? "journey.gapMetric" : "journey.cashMetric", {
          amount: money(model.forecast.lowest < 0 ? -model.forecast.lowest : model.forecast.safe),
        })
      : t("journey.noTimeline"),
    income: t("journey.incomeMetric", { n: model.months }),
    bills: t("journey.billMetric", {
      amount: money(data.budget.bills.reduce((sum, b) => sum + b.amount, 0)),
    }),
    spending: t("journey.spendMetric", { n: model.sorted, total: data.spending.length }),
    goal: t("journey.goalMetric", { amount: money(model.goalSaved) }),
    credit: t("journey.creditMetric", { n: model.lessons }),
    cushion: t("journey.cushionMetric", {
      amount: money(data.emergency.amount),
      target: money(data.emergency.target),
    }),
    debt: t("journey.debtProgress", { n: data.debts.length, amount: money(model.debt) }),
    tanda: t("tanda.tracked", { n: data.tandas.length }),
  };
  const stage = homeStages[stageIndex] ?? homeStages[0];
  const row = (id: HomeTaskId) => (
    <li key={id}>
      <Link
        to="/"
        search={{ task: id }}
        aria-current={task === id ? "page" : undefined}
        className={cn(
          "flex min-h-16 items-center gap-3 rounded-md px-3 py-3 transition-colors hover:bg-muted",
          task === id && "bg-primary-soft",
        )}
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full border text-xs",
            isFoundationTask(id) && model.progress[id] === 1
              ? "border-safe bg-safe-soft text-safe"
              : "border-border text-primary-strong",
          )}
        >
          {isFoundationTask(id) && model.progress[id] === 1 ? (
            <Check className="size-4" />
          ) : (
            <BrandIcon name={stage.icon} className="size-4" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">{t(homeTaskTitles[id])}</span>
          {id in metrics && (
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
              {metrics[id as keyof typeof metrics]}
            </span>
          )}
        </span>
        <ArrowRight className="size-4 shrink-0 text-primary" />
      </Link>
    </li>
  );
  return (
    <section aria-label={t("journey.title")} className="border-t border-border pt-6">
      <h2 className="text-lg font-semibold">{t("journey.title")}</h2>
      <ol className="mt-5">
        {homeStages.map((item, index) => {
          const done = item.tasks.filter((id) => model.progress[id] === 1).length;
          const active = stageIndex === index;
          return (
            <li
              key={item.title}
              className="relative grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3 pb-6 sm:gap-5"
            >
              {index < homeStages.length - 1 && (
                <span
                  className="absolute top-14 bottom-0 left-7 border-l-2 border-dashed border-primary/25"
                  aria-hidden
                />
              )}
              <Button
                variant="ghost"
                onClick={() => onStageChange(index)}
                aria-label={t(item.title)}
                aria-pressed={active}
                className={cn(
                  "relative z-10 size-14 rounded-full border-2 p-0",
                  done === item.tasks.length
                    ? "border-safe bg-safe-soft text-safe"
                    : active
                      ? "border-primary bg-primary-soft text-primary-strong"
                      : "border-border bg-background text-muted-foreground",
                )}
              >
                {done === item.tasks.length ? (
                  <Check className="size-6" />
                ) : (
                  <BrandIcon name={item.icon} className="size-7" />
                )}
              </Button>
              <div className="min-w-0">
                <Button
                  variant="ghost"
                  onClick={() => onStageChange(index)}
                  aria-expanded={active}
                  className="h-auto w-full justify-between gap-3 px-0 py-2 text-left"
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-normal text-muted-foreground">
                      {t("journey.stageCount", { n: index + 1 })}
                    </span>
                    <span
                      className={cn(
                        "mt-1 block text-base font-semibold",
                        active && "text-primary-strong",
                      )}
                    >
                      {t(item.title)}
                    </span>
                  </span>
                  <span className="num shrink-0 text-xs text-muted-foreground">
                    {done}/{item.tasks.length}
                  </span>
                </Button>
                {active && (
                  <div className="pt-1">
                    <p className="text-sm leading-relaxed text-muted-foreground">{t(item.body)}</p>
                    <div className="mt-4">
                      <Meter
                        value={item.tasks.reduce((sum, id) => sum + model.progress[id], 0)}
                        max={item.tasks.length}
                        label={t(item.title)}
                      />
                    </div>
                    <ul className="mt-3 divide-y divide-border">{item.tasks.map(row)}</ul>
                    <details key={stageIndex} className="mt-2 border-t border-border">
                      <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
                        {t("journey.alsoHere")}
                        <ChevronDown className="size-4" />
                      </summary>
                      <ul className="divide-y divide-border">{item.extras.map(row)}</ul>
                    </details>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="text-xs leading-relaxed text-muted-foreground">{t("journey.note")}</p>
    </section>
  );
}
