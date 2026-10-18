import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { TKey } from "@/lib/i18n";
import { useStore, uid } from "@/lib/store";
import type { Frequency } from "@/lib/store";
import { buildBudget, tandaMath } from "@/lib/finance";
import { positionLadder, tandaInsights } from "@/lib/tanda";
import { tandaEducation } from "@/data/learn";
import { PageHeader } from "@/components/AppShell";
import {
  Button,
  Field,
  MoneyInput,
  Note,
  Page,
  Section,
  Segmented,
  Stat,
  Stepper,
  TextInput,
} from "@/components/ui-kit";

export const Route = createFileRoute("/tandas/new")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Plan a tanda - Savings circle planner | Finavi" },
      {
        name: "description",
        content:
          "Set the people, the contribution, the frequency, and your turn. Compare every payout position and see what an early turn saves you against a payday loan.",
      },
      { property: "og:title", content: "Tanda planner - Finavi" },
      {
        property: "og:description",
        content: "Finavi never handles tanda money. This planner stays on your device.",
      },
    ],
  }),
  component: TandaNew,
});

function TandaNew() {
  const { t, money } = useI18n();
  const { data, update } = useStore();
  const navigate = useNavigate();
  const monthly = buildBudget(data.income)?.target ?? null;

  const [name, setName] = useState("");
  const [people, setPeople] = useState(10);
  const [contribution, setContribution] = useState<number | null>(100);
  const [frequency, setFrequency] = useState<Frequency>("biweekly");
  const [position, setPosition] = useState(4);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [organizer, setOrganizer] = useState("");
  const [error, setError] = useState<string | null>(null);

  const c = contribution ?? 0;
  const pos = Math.min(position, people);
  const draft = {
    id: "preview",
    name,
    people,
    contribution: c,
    frequency,
    position: pos,
    startDate,
    paid: [],
  };
  const preview = tandaMath(draft);
  const ins = tandaInsights(draft, monthly);
  const ladder = positionLadder(people, c, frequency);

  const save = () => {
    const clean = name.trim().slice(0, 60);
    if (!clean || !contribution || contribution <= 0) {
      setError(t("common.required"));
      return;
    }
    const id = uid();
    update((d) => ({
      ...d,
      tandas: [
        {
          id,
          name: clean,
          people,
          contribution,
          frequency,
          position: pos,
          startDate: startDate || null,
          paid: [],
          members: Array(people).fill(""),
          missed: [],
          received: false,
          organizer: organizer.trim().slice(0, 40),
        },
        ...d.tandas,
      ],
    }));
    void navigate({ to: "/tandas/$id", params: { id } });
  };

  return (
    <Page>
      <PageHeader title={t("tanda.new")} intro={t("tanda.intro")} back="/tandas" />

      <Section>
        <div className="space-y-5">
          <Field label={t("tanda.name")} htmlFor="tname" error={error ?? undefined}>
            <TextInput
              id="tname"
              value={name}
              maxLength={60}
              aria-invalid={!!error}
              placeholder={t("tanda.namePlaceholder")}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t("tanda.people")} htmlFor="people">
              <Stepper
                id="people"
                label={t("tanda.people")}
                value={people}
                min={2}
                max={40}
                onChange={(n) => {
                  setPeople(n);
                  if (position > n) setPosition(n);
                }}
              />
            </Field>
            <Field label={t("tanda.contribution")} htmlFor="contribution">
              <MoneyInput id="contribution" value={contribution} onValueChange={setContribution} />
            </Field>
            <Field label={t("tanda.position")} hint={t("tanda.positionHelp")} htmlFor="position">
              <Stepper
                id="position"
                label={t("tanda.position")}
                value={position}
                min={1}
                max={people}
                onChange={setPosition}
              />
            </Field>
            <Field label={t("tanda.start")} htmlFor="start">
              <input
                id="start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-base focus:border-primary focus:outline-none"
              />
            </Field>
          </div>

          <Field
            label={`${t("tanda.organizer")} (${t("common.optional")})`}
            hint={t("tanda.organizerHelp")}
            htmlFor="org"
          >
            <TextInput
              id="org"
              value={organizer}
              maxLength={40}
              placeholder={t("tanda.memberPlaceholder")}
              onChange={(e) => setOrganizer(e.target.value)}
            />
          </Field>

          <Segmented<Frequency>
            label={t("tanda.frequency")}
            value={frequency}
            onChange={setFrequency}
            options={[
              { value: "weekly", label: t("tanda.freq.weekly") },
              { value: "biweekly", label: t("tanda.freq.biweekly") },
              { value: "monthly", label: t("tanda.freq.monthly") },
            ]}
          />

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-5 sm:grid-cols-4">
            <Stat label={t("tanda.payout")} value={money(preview.payout)} tone="primary" />
            <Stat
              label={t("tanda.totalContrib")}
              value={money(preview.totalContributions)}
              size="sm"
            />
            <Stat
              label={t("tanda.atRisk")}
              value={money(ins.exposure)}
              size="sm"
              hint={t("tanda.atRiskHelp")}
            />
            <Stat
              label={t("tanda.perMonth")}
              value={money(Math.round(ins.perMonth))}
              size="sm"
              {...(ins.incomeShare !== null
                ? { hint: t("tanda.incomeShare", { pct: Math.round(ins.incomeShare * 100) }) }
                : {})}
            />
          </dl>

          <Button size="lg" full onClick={save}>
            {t("tanda.create")}
          </Button>
        </div>
      </Section>

      <Section title={t("tanda.positionValue")} description={t("tanda.positionValueIntro")}>
        <Note tone={ins.row.role === "advance" ? "safe" : "info"}>
          {ins.row.role === "advance"
            ? t("tanda.advanceBody", {
                n: pos,
                net: money(ins.row.net),
                days: ins.row.days,
                payday: money(Math.round(ins.row.paydayCost)),
                cu: money(Math.round(ins.row.creditUnionCost)),
              })
            : ins.row.role === "savings"
              ? t("tanda.savingsBody", {
                  n: pos,
                  exposure: money(ins.row.exposure),
                  days: ins.row.days,
                  opp: money(Math.round(ins.row.opportunityCost)),
                })
              : t("tanda.evenBody", { n: pos })}
        </Note>
      </Section>

      <Section title={t("tanda.ladder")} description={t("tanda.ladderIntro")}>
        <div className="overflow-x-auto border-y border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[0.8rem] text-muted-foreground">
                <th className="py-2.5 pr-3 font-medium">{t("tanda.col.position")}</th>
                <th className="py-2.5 pr-3 font-medium">{t("tanda.col.role")}</th>
                <th className="py-2.5 pr-3 text-right font-medium">{t("tanda.col.net")}</th>
                <th className="py-2.5 text-right font-medium">{t("tanda.col.exposure")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ladder.map((row) => (
                <tr
                  key={row.position}
                  className={row.position === pos ? "bg-primary-soft/60" : undefined}
                >
                  <td className="num py-2.5 pr-3 font-semibold">
                    {row.position}
                    {row.position === pos && (
                      <span className="ml-2 rounded-sm bg-primary px-1.5 py-0.5 text-[0.65rem] font-semibold text-background">
                        {t("tanda.yourTurn")}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-muted-foreground">
                    {t(`tanda.role.${row.role}` as TKey)}
                  </td>
                  <td className="num py-2.5 pr-3 text-right font-medium">
                    {row.net > 0 ? `+${money(row.net)}` : money(row.net)}
                  </td>
                  <td className="num py-2.5 text-right text-muted-foreground">
                    {money(row.exposure)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </Page>
  );
}
