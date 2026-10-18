import { useRef, useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Play,
  ChevronDown,
  MessageCircle,
  ChartColumn,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cashForecast } from "@/lib/money-plan";
import { moneyJourney } from "@/lib/money-journey";
import { homeStages, homeTaskTitles, parseHomeTask, taskStage } from "@/data/home-tasks";
import { Button, Page, Stat } from "./ui-kit";
import { MoneyPath } from "./MoneyPath";
import { PlanningProgress } from "./PlanningProgress";
import { CashflowChart } from "./CashflowChart";
import { HomeWorkspace } from "./HomeWorkspace";
import { BrandIcon } from "./BrandIcon";

export function HomeJourney({ initialStage }: { initialStage?: number }) {
  const { t, money } = useI18n();
  const { data } = useStore();
  const moneyPicture = useRef<HTMLDetailsElement>(null);
  const seasonalGraph = useRef<HTMLDivElement>(null);
  const search = useSearch({ strict: false });
  const task = parseHomeTask(search.task);
  const model = moneyJourney(data);
  const [selectedStage, setSelectedStage] = useState<number | undefined>(initialStage);
  const stageIndex = task ? taskStage(task) : (selectedStage ?? taskStage(model.focus));
  const stage = homeStages[stageIndex] ?? homeStages[0];
  const forecast = cashForecast(data.moneyPlan);
  const started = data.moneyPlan.cash !== 0 || data.moneyPlan.events.length > 0;

  return (
    <Page className="max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4 pt-8 pb-5">
        <div className="min-w-0">
          {task && (
            <Button asChild variant="ghost" className="mb-3 px-0 text-muted-foreground">
              <Link to="/" search={{ task: undefined }}>
                <ArrowLeft className="size-4" />
                {t("journey.returnPath")}
              </Link>
            </Button>
          )}
          <h1 className="max-w-2xl text-2xl leading-snug font-semibold sm:text-3xl">
            {t(task ? homeTaskTitles[task] : "journey.homeTitle")}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {t(task ? stage.body : "journey.homeBody")}
          </p>
        </div>
        {task && (
          <span className="num flex items-center gap-2 text-sm text-primary-strong">
            <BrandIcon name="sprout" className="size-5" />
            {model.score} / 100
          </span>
        )}
      </div>

      {task ? (
        <>
          <HomeWorkspace key={task} task={task} />
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3.5" />
              {t("journey.savedLocally")}
            </span>
            <Button asChild>
              <Link to="/" search={{ task: undefined }}>
                {t("journey.finishTask")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <PlanningProgress />
          <div
            className="flex flex-wrap items-center gap-3 py-5"
            aria-label={t("journey.quickActions")}
          >
            <Button asChild variant="secondary" size="sm">
              <Link to="/" search={{ task: "tanda" }}>
                <BrandIcon name="circle" className="size-5" />
                {t("nav.tandas")}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/" search={{ task: "coach" }}>
                <MessageCircle className="size-4" />
                {t("journey.coach")}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-controls="seasonal-income-graph"
              onClick={() => {
                if (!moneyPicture.current) return;
                moneyPicture.current.open = true;
                seasonalGraph.current?.scrollIntoView({
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "instant"
                    : "smooth",
                  block: "start",
                });
                seasonalGraph.current?.focus({ preventScroll: true });
              }}
            >
              <ChartColumn className="size-4" />
              {t("journey.seasonalGraph")}
            </Button>
          </div>
          <MoneyPath stageIndex={stageIndex} onStageChange={setSelectedStage} />
          <details ref={moneyPicture} className="group mt-8 border-y border-border">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 py-4 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-3">
                <BrandIcon name="wallet" className="size-6 text-primary" />
                <span className="font-medium">{t("journey.moneyPicture")}</span>
              </span>
              <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="pb-6">
              {started && (
                <section className="border-b border-border pb-5" aria-labelledby="weekly-overview">
                  <h2 id="weekly-overview" className="text-sm font-medium">
                    {t("journey.today")}
                  </h2>
                  <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <Stat
                      label={t(forecast.lowest < 0 ? "journey.shortfall" : "upgrade.safe")}
                      value={money(forecast.lowest < 0 ? -forecast.lowest : forecast.safe)}
                      tone={forecast.lowest < 0 ? "danger" : "primary"}
                    />
                    <Stat
                      label={t("upgrade.incoming")}
                      value={money(forecast.income)}
                      size="sm"
                      tone="safe"
                    />
                    <Stat label={t("upgrade.outgoing")} value={money(forecast.bills)} size="sm" />
                  </dl>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t("connected.homeEstimate")}
                  </p>
                </section>
              )}
              <div
                ref={seasonalGraph}
                id="seasonal-income-graph"
                tabIndex={-1}
                className="scroll-mt-5"
              >
                <CashflowChart />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Button asChild variant="ghost" className="h-auto justify-start py-3">
                  <Link to="/" search={{ task: "cushion" }}>
                    <BrandIcon name="jar" className="size-8 text-safe" />
                    <span className="min-w-0 text-left">
                      <span className="block text-xs text-muted-foreground">
                        {t("journey.cushion")}
                      </span>
                      <span className="num mt-1 block">
                        {t("journey.cushionMetric", {
                          amount: money(data.emergency.amount),
                          target: money(data.emergency.target),
                        })}
                      </span>
                    </span>
                    <ArrowRight className="ml-auto size-4 shrink-0" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="h-auto justify-start py-3">
                  <Link to="/" search={{ task: "goal" }}>
                    <BrandIcon name="sprout" className="size-8 text-primary" />
                    <span className="text-left">
                      <span className="block text-xs text-muted-foreground">
                        {t("journey.goals")}
                      </span>
                      <span className="num mt-1 block">{money(model.goalSaved)}</span>
                    </span>
                    <ArrowRight className="ml-auto size-4 shrink-0" />
                  </Link>
                </Button>
              </div>
            </div>
          </details>
        </>
      )}
      <footer className="mt-8 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-border pt-4">
        <div className="flex flex-wrap gap-4">
          {(["history", "reminders"] as const).map((id) => (
            <Button
              key={id}
              asChild
              variant="ghost"
              size="sm"
              className="px-0 text-muted-foreground"
            >
              <Link to="/" search={{ task: id }}>
                {t(homeTaskTitles[id])}
              </Link>
            </Button>
          ))}
        </div>
        <Button asChild variant="ghost" size="sm" className="px-0 text-muted-foreground">
          <Link to="/walkthrough">
            <Play className="size-3.5" />
            {t("feedback.watch")}
          </Link>
        </Button>
        <p className="flex w-full items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <Lock className="mt-0.5 size-3.5 shrink-0" />
          <span>
            {t("home.privacyNote")}{" "}
            <Link to="/privacy" className="text-primary-strong underline">
              {t("journey.privacyLink")}
            </Link>
          </span>
        </p>
      </footer>
    </Page>
  );
}
