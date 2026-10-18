import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, CalendarPlus, AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { TKey } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import type { Tanda } from "@/lib/store";
import { buildBudget, tandaMath } from "@/lib/finance";
import { downloadIcs, positionLadder, tandaIcs, tandaInsights } from "@/lib/tanda";
import { PageHeader } from "@/components/AppShell";
import {
  Button,
  EmptyState,
  Meter,
  Note,
  Page,
  Section,
  Stat,
  TextInput,
} from "@/components/ui-kit";

export const Route = createFileRoute("/tandas/$id")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Tanda tracker - Rounds, payout, and risk | Finavi" },
      {
        name: "description",
        content:
          "Track each round of your savings circle, mark contributions as paid, flag missed payments, and see how much you have at risk before your payout lands.",
      },
      { property: "og:title", content: "Tanda tracker - Finavi" },
      {
        property: "og:description",
        content: "Rounds, dates, members, and your payout position, kept on your device.",
      },
    ],
  }),
  component: TandaDetail,
});

const riskTone = { low: "safe", medium: "caution", high: "danger" } as const;
const riskStat = { low: "safe", medium: "caution", high: "danger" } as const;

function TandaDetail() {
  const { id } = Route.useParams();
  const { t, money, formatDate } = useI18n();
  const { data, update } = useStore();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  const tanda = data.tandas.find((x) => x.id === id);
  const monthly = buildBudget(data.income)?.target ?? null;

  if (!tanda) {
    return (
      <Page>
        <PageHeader title={t("tanda.hub")} back="/tandas" />
        <Section>
          <EmptyState title={t("tanda.emptyTitle")} body={t("tanda.emptyBody")} />
        </Section>
      </Page>
    );
  }

  const m = tandaMath(tanda);
  const ins = tandaInsights(tanda, monthly);
  const ladder = positionLadder(tanda.people, tanda.contribution, tanda.frequency);
  const missed = tanda.missed ?? [];
  const members = tanda.members ?? [];

  const patch = (fn: (x: Tanda) => Tanda) =>
    update((d) => ({ ...d, tandas: d.tandas.map((x) => (x.id === tanda.id ? fn(x) : x)) }));

  const togglePaid = (round: number) =>
    patch((x) => ({
      ...x,
      paid: x.paid.includes(round)
        ? x.paid.filter((r) => r !== round)
        : [...x.paid, round].sort((a, b) => a - b),
    }));

  const toggleMissed = (round: number) =>
    patch((x) => {
      const cur = x.missed ?? [];
      return {
        ...x,
        missed: cur.includes(round)
          ? cur.filter((r) => r !== round)
          : [...cur, round].sort((a, b) => a - b),
      };
    });

  const setMember = (index: number, value: string) =>
    patch((x) => {
      const next = Array.from({ length: x.people }, (_, i) => x.members?.[i] ?? "");
      next[index] = value.slice(0, 40);
      return { ...x, members: next };
    });

  const dueLabel =
    ins.daysToNext === null
      ? t("tanda.noDate")
      : ins.daysToNext < 0
        ? t("tanda.overdue", { n: Math.abs(ins.daysToNext) })
        : ins.daysToNext === 0
          ? t("tanda.dueToday")
          : t("tanda.dueIn", { n: ins.daysToNext });

  return (
    <Page>
      <PageHeader title={tanda.name} back="/tandas" />

      <Section>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-5 sm:grid-cols-4">
          <Stat label={t("tanda.payout")} value={money(m.payout)} tone="primary" />
          <Stat
            label={t("tanda.atRisk")}
            value={money(Math.max(0, ins.exposure - ins.paidSoFar))}
            size="sm"
          />
          <Stat label={t("tanda.paidSoFar")} value={money(ins.paidSoFar)} size="sm" />
          <Stat
            label={t("tanda.payoutTiming")}
            value={
              m.payoutDate ? formatDate(m.payoutDate) : `${t("tanda.round")} ${tanda.position}`
            }
            size="sm"
          />
        </dl>

        <div className="mt-4">
          <Meter
            value={tanda.paid.length}
            max={m.rounds}
            label={t("tanda.progress", { paid: tanda.paid.length, total: m.rounds })}
            tone={tanda.paid.length >= m.rounds ? "safe" : "primary"}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {t("tanda.progress", { paid: tanda.paid.length, total: m.rounds })} ·{" "}
            {t("tanda.roundsLeft", { n: Math.max(0, m.rounds - tanda.paid.length) })}
          </p>
        </div>

        {m.nextUnpaidRound && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-border py-4">
            <p className="num text-[0.95rem] font-medium">
              {t("tanda.nextPayment")}: {money(tanda.contribution)} · {t("tanda.round")}{" "}
              {m.nextUnpaidRound}
              {m.nextDate ? ` · ${formatDate(m.nextDate)}` : ""}
            </p>
            <span
              className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${
                (ins.daysToNext ?? 1) < 0
                  ? "bg-danger-soft text-danger"
                  : "bg-primary-soft text-primary-strong"
              }`}
            >
              {dueLabel}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                downloadIcs(
                  `${tanda.name.replace(/\s+/g, "-").toLowerCase()}.ics`,
                  tandaIcs(tanda, {
                    contribution: t("tanda.nextContribution"),
                    payout: t("tanda.yourPayout"),
                  }),
                )
              }
            >
              <CalendarPlus className="size-4" /> {t("tanda.addCalendar")}
            </Button>
          </div>
        )}
      </Section>

      <Section title={t("tanda.health")}>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-5 sm:grid-cols-3">
          <Stat
            label={t("tanda.healthScore")}
            value={t(`tanda.risk.${ins.level}` as TKey)}
            tone={riskStat[ins.level]}
          />
          <Stat label={t("tanda.perMonth")} value={money(Math.round(ins.perMonth))} size="sm" />
          <Stat label={t("tanda.remainingToPay")} value={money(ins.remainingToPay)} size="sm" />
        </dl>
        <div className="mt-4 space-y-2">
          {ins.flags.length === 0 ? (
            <Note tone="safe">{t("tanda.risk.none")}</Note>
          ) : (
            ins.flags.map((f) => (
              <Note key={f} tone={riskTone[ins.level]}>
                {t(f as TKey)}
              </Note>
            ))
          )}
        </div>
        {ins.incomeShare !== null && (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("tanda.incomeShare", { pct: Math.round(ins.incomeShare * 100) })}
          </p>
        )}
      </Section>

      <Section title={t("tanda.positionValue")} description={t("tanda.positionValueIntro")}>
        <Note tone={ins.row.role === "advance" ? "safe" : "info"}>
          {ins.row.role === "advance"
            ? t("tanda.advanceBody", {
                n: tanda.position,
                net: money(ins.row.net),
                days: ins.row.days,
                payday: money(Math.round(ins.row.paydayCost)),
                cu: money(Math.round(ins.row.creditUnionCost)),
              })
            : ins.row.role === "savings"
              ? t("tanda.savingsBody", {
                  n: tanda.position,
                  exposure: money(ins.row.exposure),
                  days: ins.row.days,
                  opp: money(Math.round(ins.row.opportunityCost)),
                })
              : t("tanda.evenBody", { n: tanda.position })}
        </Note>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-5">
          {ins.row.role === "advance" ? (
            <>
              <Stat
                label={t("tanda.vsPayday")}
                value={money(Math.round(ins.row.paydayCost))}
                tone="safe"
                size="sm"
              />
              <Stat
                label={t("tanda.vsCU")}
                value={money(Math.round(ins.row.creditUnionCost))}
                size="sm"
              />
            </>
          ) : (
            <>
              <Stat
                label={t("tanda.oppCost")}
                value={money(Math.round(ins.row.opportunityCost))}
                size="sm"
              />
              <Stat label={t("tanda.col.exposure")} value={money(ins.row.exposure)} size="sm" />
            </>
          )}
        </dl>
      </Section>

      <Section title={t("tanda.timeline")}>
        {missed.length > 0 && (
          <div className="mb-4">
            <Note tone="danger">{t("tanda.missedNote", { n: missed.length })}</Note>
          </div>
        )}
        <ul className="divide-y divide-border border-y border-border">
          {Array.from({ length: m.rounds }, (_, i) => i + 1).map((round) => {
            const paid = tanda.paid.includes(round);
            const mine = round === tanda.position;
            const date = m.roundDates[round - 1];
            const flagged = missed.includes(round);
            const who = members[round - 1];
            return (
              <li key={round} className="flex items-center gap-3 py-3">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={paid}
                  aria-label={t("tanda.markPaid", { n: round })}
                  onClick={() => togglePaid(round)}
                  className={`flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    paid
                      ? "border-safe bg-safe text-background"
                      : "border-border-strong bg-surface text-transparent hover:border-foreground/40"
                  }`}
                >
                  <Check className="size-4" aria-hidden />
                </button>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.95rem] font-medium">
                    {t("tanda.round")} {round}
                    {mine && (
                      <span className="ml-2 rounded-sm bg-primary-soft px-1.5 py-0.5 text-xs font-semibold text-primary-strong">
                        {t("tanda.yourPayout")}
                      </span>
                    )}
                    {who ? (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">{who}</span>
                    ) : null}
                  </span>
                  {date && (
                    <span className="block text-sm text-muted-foreground">{formatDate(date)}</span>
                  )}
                </span>
                <button
                  type="button"
                  aria-pressed={flagged}
                  aria-label={flagged ? t("tanda.unflagMissed") : t("tanda.flagMissed")}
                  title={flagged ? t("tanda.unflagMissed") : t("tanda.flagMissed")}
                  onClick={() => toggleMissed(round)}
                  className={`flex size-9 shrink-0 items-center justify-center rounded-md transition-colors ${
                    flagged ? "text-danger" : "text-muted-foreground/40 hover:text-foreground"
                  }`}
                >
                  <AlertTriangle className="size-4" aria-hidden />
                </button>
                <span className="num shrink-0 text-sm font-semibold">
                  {mine ? `+${money(m.payout)}` : `-${money(tanda.contribution)}`}
                </span>
              </li>
            );
          })}
        </ul>
        <label className="mt-4 flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={tanda.received === true}
            onChange={(e) => patch((x) => ({ ...x, received: e.target.checked }))}
            className="size-4 accent-[oklch(0.653_0.196_44)]"
          />
          <span>
            <span className="font-medium">{t("tanda.received")}</span>
            <span className="block text-muted-foreground">{t("tanda.receivedHelp")}</span>
          </span>
        </label>
      </Section>

      <Section title={t("tanda.members")} description={t("tanda.membersHelp")}>
        <div className="grid gap-3 border-y border-border py-5 sm:grid-cols-2">
          {Array.from({ length: tanda.people }, (_, i) => (
            <label key={i} className="flex items-center gap-3 text-sm">
              <span className="num w-16 shrink-0 text-muted-foreground">
                {t("tanda.round")} {i + 1}
              </span>
              <TextInput
                value={members[i] ?? ""}
                maxLength={40}
                placeholder={t("tanda.memberPlaceholder")}
                aria-label={t("tanda.memberN", { n: i + 1 })}
                onChange={(e) => setMember(i, e.target.value)}
              />
            </label>
          ))}
        </div>
        {tanda.organizer ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("tanda.organizer")}:{" "}
            <span className="font-medium text-foreground">{tanda.organizer}</span>
          </p>
        ) : null}
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
                  className={row.position === tanda.position ? "bg-primary-soft/60" : undefined}
                >
                  <td className="num py-2.5 pr-3 font-semibold">{row.position}</td>
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
      </Section>

      <Section title={t("tanda.safety")}>
        <ul className="space-y-2.5 border-y border-border py-5">
          {["1", "2", "3", "4", "5", "6"].map((n) => (
            <li key={n} className="flex gap-3 text-sm leading-relaxed">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{t(`tanda.safety.${n}` as TKey)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Note tone="info">{t("tanda.noInterest")}</Note>
        </div>
      </Section>

      <Section>
        {confirm ? (
          <div>
            <Note tone="danger">{t("tanda.deleteConfirm")}</Note>
            <div className="mt-3 flex gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  update((d) => ({ ...d, tandas: d.tandas.filter((x) => x.id !== tanda.id) }));
                  void navigate({ to: "/tandas" });
                }}
              >
                {t("common.delete")}
              </Button>
              <Button variant="ghost" onClick={() => setConfirm(false)}>
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirm(true)}>
            {t("common.delete")}
          </Button>
        )}
      </Section>
    </Page>
  );
}
