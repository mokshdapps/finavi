import { Trophy, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { foundationWeights, moneyJourney, type JourneyTaskId } from "@/lib/money-journey";
import { Button } from "./ui-kit";

export function PlanningProgress() {
  const { data } = useStore();
  const { t, money } = useI18n();
  const model = moneyJourney(data);
  const circumference = 2 * Math.PI * 46;
  return (
    <section
      className="border-y border-border bg-primary-soft/40 px-5 py-6 sm:px-7"
      aria-labelledby="current-focus"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div>
          <p className="text-xs font-semibold text-primary-strong">{t("journey.focus")}</p>
          <h2 id="current-focus" className="mt-2 text-xl leading-snug sm:text-2xl">
            {t(
              model.score === 100 && model.forecast.lowest >= data.moneyPlan.protected
                ? "journey.reviewPlan"
                : model.focus === "cash" && model.forecast.lowest >= data.moneyPlan.protected
                  ? "journey.buildCash"
                  : `journey.focus.${model.focus}`,
            )}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {model.forecast.lowest < 0
              ? t("journey.gapMetric", { amount: money(-model.forecast.lowest) })
              : model.forecast.lowest < data.moneyPlan.protected
                ? t("connected.buffer", {
                    amount: money(data.moneyPlan.protected - model.forecast.lowest),
                  })
                : model.progress[model.focus] === 1
                  ? t("journey.reviewNote")
                  : t("journey.gain", {
                      n: Math.ceil(foundationWeights[model.focus] - model.points[model.focus]),
                    })}
          </p>
        </div>
        <div
          className="relative size-20 sm:size-24"
          role="progressbar"
          aria-label={t("journey.score")}
          aria-valuenow={model.score}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <svg viewBox="0 0 112 112" className="size-full -rotate-90" aria-hidden>
            <circle
              cx="56"
              cy="56"
              r="46"
              fill="none"
              strokeWidth="8"
              className="stroke-primary/15"
            />
            <circle
              cx="56"
              cy="56"
              r="46"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - model.score / 100)}
              className="stroke-primary transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="num text-2xl font-semibold sm:text-3xl">{model.score}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>
      <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground">
        {t("journey.scoreNote")}
      </p>
      <Button asChild className="mt-4">
        <Link to="/" search={{ task: model.focus }}>
          {t(`journey.action.${model.focus}`)}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary-strong">
        <Trophy className="size-4" />
        {t(model.milestone ? "journey.milestone" : "journey.firstMilestone", {
          n: model.milestone,
        })}
      </div>
      <div className="mt-3 grid max-w-sm grid-cols-4 gap-2" aria-hidden>
        {[25, 50, 75, 100].map((value) => (
          <div key={value}>
            <span
              className={`block h-1.5 rounded-full ${model.score >= value ? "bg-primary" : "bg-primary/15"}`}
            />
            <span className="num mt-1 block text-xs text-muted-foreground">{value}</span>
          </div>
        ))}
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-medium">
          {t("journey.scoreDetails")}
        </summary>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {t("journey.scoreNote")}
        </p>
        <ul className="mt-3 divide-y divide-primary/15">
          {(Object.keys(foundationWeights) as JourneyTaskId[]).map((id) => (
            <li key={id}>
              <Link
                to="/"
                search={{ task: id }}
                className="flex min-h-11 items-center justify-between gap-3 py-2 text-sm"
              >
                <span>{t(`journey.action.${id}`)}</span>
                <span className="num shrink-0 text-primary-strong">
                  {t("journey.points", {
                    n: Math.round(model.points[id] * 10) / 10,
                    max: foundationWeights[id],
                  })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
