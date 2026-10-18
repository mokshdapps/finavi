import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore, uid } from "@/lib/store";
import { PageHeader } from "@/components/AppShell";
import { Button, Field, Meter, MoneyInput, Note, Page, Section, Stat } from "@/components/ui-kit";

const quick = [10, 25, 50, 100];

export function EmergencyPage() {
  const { t, money, formatDate } = useI18n();
  const { data, update } = useStore();
  const { amount, target, history } = data.emergency;
  const [custom, setCustom] = useState<number | null>(null);
  const [newTarget, setNewTarget] = useState<number | null>(null);
  const reached = amount >= target;

  const change = (delta: number) => {
    if (!delta) return;
    update((d) => ({
      ...d,
      emergency: {
        ...d.emergency,
        amount: Math.max(0, Math.round((d.emergency.amount + delta) * 100) / 100),
        history: [
          { id: uid(), delta, date: new Date().toISOString() },
          ...d.emergency.history,
        ].slice(0, 30),
      },
    }));
    setCustom(null);
  };

  return (
    <Page>
      <PageHeader title={t("emergency.title")} intro={t("emergency.intro")} back="/plan" />

      <Section>
        <div className="border-y border-border py-6">
          <dl className="flex items-end justify-between gap-6">
            <Stat label={t("emergency.current")} value={money(amount)} tone="primary" size="lg" />
            <Stat label={t("emergency.goal")} value={money(target)} size="sm" />
          </dl>
          <div className="mt-4">
            <Meter
              value={amount}
              max={target}
              label={t("emergency.title")}
              tone={reached ? "safe" : "primary"}
            />
          </div>
          {!reached && (
            <p className="num mt-2.5 text-sm text-muted-foreground">
              {t("emergency.remaining", { amount: money(target - amount) })}
            </p>
          )}
        </div>
      </Section>

      {reached && (
        <Section>
          <Note tone="safe" title={t("emergency.reached", { amount: money(target) })}>
            {t("emergency.reachedBody")}
          </Note>
          <div className="mt-4 flex flex-wrap items-end gap-2">
            <div className="w-40">
              <Field label={t("emergency.target")} htmlFor="newTarget">
                <MoneyInput
                  id="newTarget"
                  value={newTarget}
                  onValueChange={setNewTarget}
                  placeholder="1500"
                />
              </Field>
            </div>
            <Button
              variant="secondary"
              disabled={!newTarget || newTarget <= 0}
              onClick={() => {
                if (!newTarget || newTarget <= 0) return;
                update((d) => ({ ...d, emergency: { ...d.emergency, target: newTarget } }));
                setNewTarget(null);
              }}
            >
              {t("emergency.newTarget")}
            </Button>
          </div>
        </Section>
      )}

      <Section title={t("emergency.add")}>
        <div className="flex flex-wrap gap-2">
          {quick.map((q) => (
            <Button key={q} variant="secondary" onClick={() => change(q)} className="num">
              + {money(q)}
            </Button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-2">
          <div className="w-40">
            <Field label={t("common.custom")} htmlFor="custom">
              <MoneyInput id="custom" value={custom} onValueChange={setCustom} placeholder="0" />
            </Field>
          </div>
          <Button disabled={!custom || custom <= 0} onClick={() => change(custom ?? 0)}>
            {t("common.add")}
          </Button>
          <Button
            variant="ghost"
            disabled={!custom || custom <= 0 || amount <= 0}
            onClick={() => change(-(custom ?? 0))}
          >
            {t("emergency.remove")}
          </Button>
        </div>
      </Section>

      {history.length > 0 && (
        <Section title={t("emergency.history")}>
          <ul className="divide-y divide-border border-y border-border">
            {history.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-muted-foreground">{formatDate(h.date)}</span>
                <span className={`num font-semibold ${h.delta > 0 ? "text-safe" : "text-caution"}`}>
                  {h.delta > 0 ? "+" : "−"}
                  {money(Math.abs(h.delta))}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section>
        <Note tone="neutral">{t("common.disclaimer")}</Note>
      </Section>
    </Page>
  );
}
