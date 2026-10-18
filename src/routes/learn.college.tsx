import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/AppShell";
import { Field, MoneyInput, Note, Page, Section, Stat, Stepper } from "@/components/ui-kit";

export const Route = createFileRoute("/learn/college")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "College aid - What Pell and Washington grants can cover | Finavi" },
      {
        name: "description",
        content:
          "A rough estimate of Federal Pell Grant and Washington College Grant aid for your household size and income, plus what's likely left at a community college.",
      },
      { property: "og:title", content: "College aid - Finavi" },
      {
        property: "og:description",
        content:
          "Grant money is not repaid. See roughly how much of community college it could cover.",
      },
    ],
  }),
  component: CollegePage,
});

const PELL_MAX = 7395;
const WCG_MAX = 5100;
const CC_COST = 12000;

function fpl(size: number) {
  return 15060 + Math.max(0, size - 1) * 5380;
}

function CollegePage() {
  const { t, money } = useI18n();
  const [household, setHousehold] = useState(4);
  const [income, setIncome] = useState<number | null>(45000);
  const [students, setStudents] = useState(1);

  const est = useMemo(() => {
    const inc = income ?? 0;
    const ratio = inc / fpl(household);
    const pellFactor = ratio <= 1.75 ? 1 : ratio >= 4 ? 0 : (4 - ratio) / (4 - 1.75);
    const wcgFactor = ratio <= 3 ? 1 : ratio >= 5 ? 0 : (5 - ratio) / 2;
    const pell = Math.round((PELL_MAX * pellFactor) / 5) * 5;
    const wcg = Math.round((WCG_MAX * wcgFactor) / 5) * 5;
    const total = (pell + wcg) * students;
    return { pell, wcg, total, gap: Math.max(0, CC_COST * students - total) };
  }, [income, household, students]);

  return (
    <Page>
      <PageHeader title={t("college.title")} intro={t("college.intro")} back="/learn" />

      <Section>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label={t("college.household")} htmlFor="hh">
            <Stepper
              id="hh"
              label={t("college.household")}
              value={household}
              min={1}
              max={12}
              onChange={setHousehold}
            />
          </Field>
          <Field label={t("college.income")} htmlFor="inc">
            <MoneyInput id="inc" value={income} onValueChange={setIncome} />
          </Field>
          <Field label={t("college.students")} htmlFor="st">
            <Stepper
              id="st"
              label={t("college.students")}
              value={students}
              min={1}
              max={6}
              onChange={setStudents}
            />
          </Field>
        </div>
      </Section>

      <Section title={t("college.result")}>
        <div className="border-y border-border py-6">
          <p className="num text-5xl leading-none font-bold tracking-tight text-primary">
            {money(est.total)}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
            <Stat label={t("college.pell")} value={money(est.pell * students)} size="sm" />
            <Stat label={t("college.wcg")} value={money(est.wcg * students)} size="sm" />
            <Stat label={t("college.gap")} value={money(est.gap)} size="sm" tone="caution" />
          </dl>
        </div>
      </Section>

      <Section>
        <Note tone="caution">{t("college.disclaimer")}</Note>
      </Section>
    </Page>
  );
}
