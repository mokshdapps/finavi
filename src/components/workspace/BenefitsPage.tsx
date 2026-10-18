import { useState, type ReactNode } from "react";
import { CircleHelp, ExternalLink } from "lucide-react";
import { useI18n, type TKey } from "@/lib/i18n";
import { useStore, type BenefitAnswers } from "@/lib/store";
import { programs, screenPrograms } from "@/data/programs";
import { foodIncomeIllustration, validBenefitAnswers } from "@/lib/benefit-guidance";
import { PageHeader } from "@/components/AppShell";
import {
  Button,
  Field,
  MoneyInput,
  Note,
  Page,
  Section,
  Stepper,
  YesNo,
} from "@/components/ui-kit";
function WhyField({
  label,
  why,
  id,
  children,
}: {
  label: string;
  why: string;
  id: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div>
      <Field label={label} htmlFor={id}>
        {children}
      </Field>
      <details className="group relative mt-1">
        <summary
          title={why}
          className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 text-xs text-primary-strong"
        >
          <CircleHelp className="size-4" />
          {t("feedback.benefitWhy")}
        </summary>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{why}</p>
      </details>
    </div>
  );
}
export function BenefitsPage() {
  const { ready } = useStore();
  return ready ? <BenefitsForm /> : null;
}
function BenefitsForm() {
  const { t, lang, money } = useI18n();
  const { data, update } = useStore();
  const saved = data.benefits;
  const defaults: BenefitAnswers = {
    household: 1,
    income: 0,
    children: false,
    youngChildren: false,
    pregnant: false,
    seniorOrDisabled: false,
    paysRent: false,
    annualIncome: 0,
    monthsWorked: 0,
    childrenCount: 0,
    under5Count: 0,
    under13Count: 0,
    seniorCount: 0,
    earnedIncome: 0,
    rentAmount: 0,
    careAmount: 0,
  };
  const [a, setA] = useState<BenefitAnswers>(() =>
    saved
      ? {
          ...defaults,
          ...saved,
          childrenCount: saved.childrenCount ?? (saved.children ? 1 : 0),
          under5Count: saved.under5Count ?? (saved.youngChildren ? 1 : 0),
          under13Count: saved.under13Count ?? (saved.youngChildren ? 1 : 0),
          seniorCount: saved.seniorCount ?? (saved.seniorOrDisabled ? 1 : 0),
        }
      : defaults,
  );
  const [editing, setEditing] = useState(!saved);
  const [error, setError] = useState(false);
  const [scenario, setScenario] = useState<number | null>(null);
  const answers = saved ?? a;
  const { eligible, not } = screenPrograms(answers);
  const illustration = foodIncomeIllustration(answers, scenario ?? answers.income);
  const patch = (next: Partial<BenefitAnswers>) => setA((prev) => ({ ...prev, ...next }));
  const moneyQuestion = (key: keyof BenefitAnswers, label: TKey, why: TKey) => (
    <WhyField key={key} label={t(label)} why={t(why)} id={`benefit-${key}`}>
      <MoneyInput
        id={`benefit-${key}`}
        value={typeof a[key] === "number" ? (a[key] as number) : 0}
        onValueChange={(v) => patch({ [key]: v ?? 0 })}
      />
    </WhyField>
  );
  const countQuestion = (key: keyof BenefitAnswers, label: TKey, why: TKey, max: number) => (
    <WhyField key={key} label={t(label)} why={t(why)} id={`benefit-${key}`}>
      <Stepper
        id={`benefit-${key}`}
        label={t(label)}
        value={typeof a[key] === "number" ? (a[key] as number) : 0}
        min={key === "household" ? 1 : 0}
        max={max}
        onChange={(v) => patch({ [key]: v })}
      />
    </WhyField>
  );
  return (
    <Page>
      <PageHeader title={t("benefits.title")} intro={t("feedback.benefitScope")} back="/plan" />
      <p className="mt-2 text-xs text-muted-foreground">{t("feedback.benefitScopeFuture")}</p>
      <details className="mt-5 border-y border-border py-3">
        <summary className="min-h-9 cursor-pointer font-medium">
          {t("feedback.benefitPrograms")} ({programs.length})
        </summary>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {programs.map((p) => (
            <li key={p.id}>{p.name[lang]}</li>
          ))}
        </ul>
      </details>
      {editing ? (
        <Section>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!validBenefitAnswers(a)) {
                setError(true);
                return;
              }
              const next = {
                ...a,
                children: (a.childrenCount ?? 0) > 0,
                youngChildren: (a.under5Count ?? 0) > 0,
                seniorOrDisabled: (a.seniorCount ?? 0) > 0,
                paysRent: (a.rentAmount ?? 0) > 0,
                completedAt: new Date().toISOString(),
              };
              update((d) => ({ ...d, benefits: next }));
              setEditing(false);
              setScenario(null);
              setError(false);
            }}
          >
            {countQuestion("household", "benefits.q.household", "feedback.benefitHouseWhy", 15)}
            {moneyQuestion("income", "benefits.q.income", "feedback.benefitIncomeWhy")}
            {moneyQuestion("earnedIncome", "feedback.benefitEarned", "feedback.benefitEarnedWhy")}
            {moneyQuestion("annualIncome", "feedback.benefitAnnual", "feedback.benefitAnnualWhy")}
            {countQuestion(
              "monthsWorked",
              "feedback.benefitMonths",
              "feedback.benefitMonthsWhy",
              12,
            )}
            {countQuestion(
              "childrenCount",
              "feedback.benefitChildren",
              "feedback.benefitAgeWhy",
              a.household,
            )}
            {countQuestion(
              "under5Count",
              "feedback.benefitUnder5",
              "feedback.benefitAgeWhy",
              a.household,
            )}
            {countQuestion(
              "under13Count",
              "feedback.benefitUnder13",
              "feedback.benefitAgeWhy",
              a.household,
            )}
            {countQuestion(
              "seniorCount",
              "feedback.benefitSenior",
              "feedback.benefitAgeWhy",
              a.household,
            )}
            {moneyQuestion("rentAmount", "feedback.benefitRent", "feedback.benefitRentWhy")}
            {moneyQuestion("careAmount", "feedback.benefitCare", "feedback.benefitCareWhy")}
            <WhyField
              id="benefit-pregnant"
              label={t("benefits.q.pregnant")}
              why={t("feedback.benefitPregWhy")}
            >
              <YesNo
                label={t("benefits.q.pregnant")}
                value={a.pregnant}
                onChange={(pregnant) => patch({ pregnant })}
                yesLabel={t("common.yes")}
                noLabel={t("common.no")}
              />
            </WhyField>
            <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2">
              {t("feedback.benefitCredit")}
            </p>
            {error && (
              <p role="alert" className="text-sm text-danger sm:col-span-2">
                {t("feedback.benefitCountError")}
              </p>
            )}
            <Button type="submit" className="sm:col-span-2">
              {t("benefits.seeResults")}
            </Button>
          </form>
        </Section>
      ) : (
        <>
          <Section>
            <Note tone="neutral">{t("feedback.benefitEstimateBody")}</Note>
            <Button
              variant="secondary"
              className="mt-3"
              onClick={() => {
                setA({ ...answers });
                setEditing(true);
              }}
            >
              {t("benefits.redo")}
            </Button>
          </Section>
          <Section title={t("feedback.benefitWhatif")}>
            <Field label={t("feedback.benefitWhatifIncome")} htmlFor="benefit-scenario">
              <MoneyInput
                id="benefit-scenario"
                value={scenario ?? answers.income}
                onValueChange={setScenario}
              />
            </Field>
            {illustration && (
              <div aria-live="polite" className="mt-4 border-y border-border py-4">
                <p className="text-sm text-muted-foreground">{t("feedback.foodKnown")}</p>
                <p className="num mt-2 text-3xl font-semibold text-primary-strong">
                  {money(illustration.afterKnownDeductions)}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {t("feedback.foodKnownNote")}
                </p>
              </div>
            )}
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {t("feedback.benefitWhatifNote")}
            </p>
          </Section>
          <Section title={t("feedback.benefitWorth")} description={t("feedback.benefitUnknown")}>
            <div className="divide-y divide-border border-y border-border">
              {eligible.map((p) => (
                <article key={p.id} className="py-5">
                  <h3 className="text-lg font-semibold">{p.name[lang]}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.what[lang]}</p>
                  <details className="mt-3">
                    <summary className="min-h-9 cursor-pointer text-sm font-medium">
                      {t("feedback.benefitNext")}
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.needed[lang]}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {t("feedback.benefitAction")}
                    </p>
                  </details>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-strong"
                  >
                    {t("benefits.apply")}
                    <ExternalLink className="size-4" />
                  </a>
                </article>
              ))}
            </div>
          </Section>
          {!!not.length && (
            <Section title={t("feedback.benefitNot")}>
              <ul className="space-y-3">
                {not.map((p) => (
                  <li key={p.id} className="text-sm text-muted-foreground">
                    {p.name[lang]}
                    <a
                      className="ml-2 text-primary-strong underline"
                      href={p.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {t("benefits.apply")}
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </>
      )}
      <Section title={t("feedback.benefitSeasonTitle")}>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("feedback.policyDate")}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t("feedback.benefitSeasonBody")}
        </p>
        <ul className="mt-3 space-y-2">
          {[
            {
              label: "Washington HCA: Apple Health changes",
              url: "https://www.hca.wa.gov/free-or-low-cost-health-care/apple-health-medicaid-coverage",
            },
            {
              label: "CMS: Community engagement",
              url: "https://www.medicaid.gov/resources-for-states/working-families-tax-cut-legislation/community-engagement",
            },
            {
              label: "CMS: Six-month renewals (2026 guidance)",
              url: "https://www.medicaid.gov/federal-policy-guidance/downloads/smd26001.pdf",
            },
            {
              label: "DSHS: Basic Food deductions",
              url: "https://app.leg.wa.gov/wac/default.aspx?cite=388-450-0185",
            },
            {
              label: "DSHS: Basic Food FAQs",
              url: "https://www.dshs.wa.gov/family-food-and-housing-services/food-assistance/basic-food-benefits-snap/basic-food-faqs",
            },
          ].map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center gap-2 text-sm text-primary-strong underline"
              >
                {s.label}
                <ExternalLink className="size-4 shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <Note tone="caution">{t("benefits.disclaimer")}</Note>
      </Section>
    </Page>
  );
}
