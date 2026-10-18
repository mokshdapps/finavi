import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import type { TKey } from "@/lib/i18n";
import { tandaEducation } from "@/data/learn";
import { PageHeader } from "@/components/AppShell";
import { Button, Note, Page, Section, Stat } from "@/components/ui-kit";

export function TandaLearn() {
  const { t, money } = useI18n();
  const people = 10;
  const contribution = 100;
  const payout = people * contribution;

  return (
    <Page>
      <PageHeader title={t("learn.tanda")} intro={t("tanda.intro")} back="/learn" />

      <Section title={t("tanda.scenario")} description={t("tanda.scenarioIntro")}>
        <dl className="grid grid-cols-2 gap-5 border-y border-border py-5 sm:grid-cols-3">
          <Stat label={t("tanda.people")} value={String(people)} size="sm" />
          <Stat label={t("tanda.contribution")} value={money(contribution)} size="sm" />
          <Stat label={t("tanda.payout")} value={money(payout)} tone="primary" size="sm" />
        </dl>

        <div className="mt-5 divide-y divide-border border-y border-border">
          <div className="py-4">
            <h2 className="font-semibold">{t("tanda.scenarioEarly", { n: 2 })}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {t("tanda.scenarioEarlyBody", {
                payout: money(payout),
                paid: money(2 * contribution),
                owed: money(payout - 2 * contribution),
              })}
            </p>
          </div>
          <div className="py-4">
            <h2 className="font-semibold">{t("tanda.scenarioLate", { n: people })}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {t("tanda.scenarioLateBody", {
                paid: money(people * contribution),
                payout: money(payout),
              })}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Note tone="info">{t("tanda.noInterest")}</Note>
        </div>
      </Section>

      <Section title={t("tanda.before")}>
        <ul className="space-y-2.5 border-y border-border py-5">
          {tandaEducation.map((key) => (
            <li key={key} className="flex gap-3 text-sm leading-relaxed">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{t(key as TKey)}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Link to="/tandas/new">
          <Button>{t("tanda.new")}</Button>
        </Link>
      </Section>
    </Page>
  );
}
