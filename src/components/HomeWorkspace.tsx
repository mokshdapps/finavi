import { lazy, Suspense } from "react";
import { LocalCoach } from "./LocalCoach";
import { FinancialCheckIn } from "./FinancialCheckIn";
import { PlanReminders } from "./PlanReminders";
import { useI18n } from "@/lib/i18n";
import type { HomeTaskId } from "@/data/home-tasks";

const WeeklyPlan = lazy(() =>
  import("./workspace/WeeklyPlan").then((m) => ({ default: m.WeeklyPlan })),
);
const BudgetPage = lazy(() =>
  import("./workspace/BudgetPage").then((m) => ({ default: m.BudgetPage })),
);
const SpendingPage = lazy(() =>
  import("./workspace/SpendingPage").then((m) => ({ default: m.SpendingPage })),
);
const JarsPage = lazy(() => import("./workspace/JarsPage").then((m) => ({ default: m.JarsPage })));
const EmergencyPage = lazy(() =>
  import("./workspace/EmergencyPage").then((m) => ({ default: m.EmergencyPage })),
);
const DebtLab = lazy(() => import("./workspace/DebtLab").then((m) => ({ default: m.DebtLab })));
const BenefitsPage = lazy(() =>
  import("./workspace/BenefitsPage").then((m) => ({ default: m.BenefitsPage })),
);
const TrapPage = lazy(() => import("./workspace/TrapPage").then((m) => ({ default: m.TrapPage })));
const WorkComparison = lazy(() =>
  import("./workspace/WorkComparison").then((m) => ({ default: m.WorkComparison })),
);
const TandasHub = lazy(() =>
  import("./workspace/TandasHub").then((m) => ({ default: m.TandasHub })),
);
const CreditCourse = lazy(() =>
  import("./workspace/CreditCourse").then((m) => ({ default: m.CreditCourse })),
);
const InvestPage = lazy(() =>
  import("./workspace/InvestPage").then((m) => ({ default: m.InvestPage })),
);
const MoneyPractice = lazy(() =>
  import("./workspace/MoneyPractice").then((m) => ({ default: m.MoneyPractice })),
);
const TandaLearn = lazy(() =>
  import("./workspace/TandaLearn").then((m) => ({ default: m.TandaLearn })),
);

export function HomeWorkspace({ task }: { task: HomeTaskId }) {
  const { t } = useI18n();
  return (
    <div data-workspace className="min-w-0">
      <Suspense
        fallback={
          <p role="status" className="py-8 text-sm text-muted-foreground">
            {t("journey.loading")}
          </p>
        }
      >
        {task === "cash" && <WeeklyPlan />}
        {(task === "income" || task === "bills") && (
          <BudgetPage key={task} initialTab={task === "bills" ? "bills" : "year"} />
        )}
        {task === "spending" && <SpendingPage />}
        {task === "goal" && <JarsPage />}
        {task === "cushion" && <EmergencyPage />}
        {task === "debt" && <DebtLab />}
        {task === "benefits" && <BenefitsPage />}
        {task === "trap" && <TrapPage />}
        {task === "work" && <WorkComparison />}
        {task === "tanda" && <TandasHub />}
        {task === "credit" && <CreditCourse />}
        {task === "invest" && <InvestPage />}
        {task === "practice" && <MoneyPractice />}
        {task === "tandaLearn" && <TandaLearn />}
        {task === "college" && <CollegeSupport />}
        {task === "coach" && <LocalCoach />}
        {task === "history" && <FinancialCheckIn compact />}
        {task === "reminders" && <PlanReminders />}
      </Suspense>
    </div>
  );
}

function CollegeSupport() {
  const { t } = useI18n();
  return (
    <div className="space-y-4 py-5 text-sm leading-relaxed">
      <p>{t("journey.collegeGuidance")}</p>
      <a
        href="https://wsac.wa.gov/wasfa"
        target="_blank"
        rel="noreferrer noopener"
        className="block text-primary-strong underline"
      >
        WASFA
      </a>
      <a
        href="https://studentaid.gov/h/apply-for-aid/fafsa"
        target="_blank"
        rel="noreferrer noopener"
        className="block text-primary-strong underline"
      >
        FAFSA
      </a>
      <a
        href="https://wsac.wa.gov/wcg"
        target="_blank"
        rel="noreferrer noopener"
        className="block text-primary-strong underline"
      >
        Washington College Grant
      </a>
    </div>
  );
}
