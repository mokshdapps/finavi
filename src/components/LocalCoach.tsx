import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Send, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { financialCheckIn, coachTopic, type CoachTopic } from "@/lib/financial-checkin";
import { Button, Section, TextInput } from "./ui-kit";
const topics = ["cash", "season", "benefits", "debt", "spending", "savings"] as const;
const routes = {
  cash: "/plan/week",
  season: "/plan/budget",
  benefits: "/plan/benefits",
  debt: "/plan/debt",
  spending: "/goals/spending",
  savings: "/goals/jars",
} as const;
const keys = {
  cash: "feedback.coachCash",
  season: "feedback.coachSeason",
  benefits: "feedback.coachBenefits",
  debt: "feedback.coachDebt",
  spending: "feedback.coachSpending",
  savings: "feedback.coachSavings",
} as const;
export function LocalCoach() {
  const { t, money } = useI18n();
  const { data } = useStore();
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState<CoachTopic | null>(null);
  const c = financialCheckIn(data);
  const variables = {
    amount: money(
      topic === "season"
        ? (c.harvest?.safePaycheck ?? 0)
        : topic === "cash"
          ? c.forecast.lowest
          : topic === "spending"
            ? data.spending.filter((s) => s.category === "want").reduce((a, s) => a + s.amount, 0)
            : c.forecast.safe,
    ),
    protected: money(data.moneyPlan.protected),
    reserve: money(c.harvest?.reserveNeeded ?? 0),
    saved: money(data.emergency.amount),
    target: money(data.emergency.target),
  };
  const answer =
    topic === "unknown"
      ? "feedback.coachUnknown"
      : topic === "cash" && !c.started
        ? "feedback.priorityStartBody"
        : topic === "season" && !c.harvest
          ? "feedback.coachNeedSeason"
          : topic === "cash"
            ? "feedback.coachCashAnswer"
            : topic === "season"
              ? "feedback.coachSeasonAnswer"
              : topic === "benefits"
                ? "feedback.coachBenefitsAnswer"
                : topic === "debt"
                  ? "feedback.coachDebtAnswer"
                  : topic === "spending"
                    ? "feedback.coachSpendAnswer"
                    : "feedback.coachSaveAnswer";
  return (
    <Section title={t("feedback.coachTitle")} description={t("feedback.coachIntro")}>
      <form
        className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          if (question.trim()) setTopic(coachTopic(question));
        }}
      >
        <TextInput
          aria-label={t("feedback.coachAsk")}
          placeholder={t("feedback.coachPlaceholder")}
          value={question}
          maxLength={400}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <Button type="submit">
          <Send className="size-4" />
          {t("feedback.coachAsk")}
        </Button>
      </form>
      <div className="mt-3 grid gap-1 sm:grid-cols-2">
        {topics.map((item) => (
          <Button
            key={item}
            variant="ghost"
            className="justify-start text-left text-sm"
            onClick={() => {
              setTopic(item);
              setQuestion(t(keys[item]));
            }}
          >
            {t(keys[item])}
          </Button>
        ))}
      </div>
      {topic && (
        <div
          aria-live="polite"
          className="mt-4 border-l-3 border-primary bg-primary-soft px-4 py-4"
        >
          <p className="text-sm leading-relaxed">{t(answer, variables)}</p>
          {topic !== "unknown" && (
            <Button asChild variant="ghost" className="mt-3 px-0 text-primary-strong">
              <Link to={routes[topic]}>
                {t("feedback.openTool")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      )}
      <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-safe" />
        {t("feedback.coachLocal")}
      </p>
    </Section>
  );
}
