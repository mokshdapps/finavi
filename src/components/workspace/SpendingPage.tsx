import { spendingReview } from "@/lib/debt-priority";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore, uid, demoData } from "@/lib/store";
import type { SpendCategory } from "@/lib/store";
import { PageHeader } from "@/components/AppShell";
import {
  Button,
  EmptyState,
  Field,
  MoneyInput,
  Note,
  Page,
  Section,
  Segmented,
  Stat,
  TextInput,
} from "@/components/ui-kit";

export function SpendingPage() {
  const { t, money } = useI18n();
  const { data, update } = useStore();
  const [reduction, setReduction] = useState(25);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const items = data.spending;
  const total = items.reduce((a, s) => a + s.amount, 0);
  const sum = (c: SpendCategory) =>
    items.filter((s) => s.category === c).reduce((a, s) => a + s.amount, 0);
  const pct = (c: SpendCategory) => (total > 0 ? Math.round((sum(c) / total) * 100) : 0);
  const unsorted = items.filter((s) => s.category === "unsure").length;

  const add = () => {
    const clean = label.trim().slice(0, 60);
    if (!clean || !amount || amount <= 0) {
      setError(t("common.required"));
      return;
    }
    setError(null);
    update((d) => ({
      ...d,
      spending: [{ id: uid(), label: clean, amount, category: "unsure" }, ...d.spending],
    }));
    setLabel("");
    setAmount(null);
  };

  return (
    <Page>
      <PageHeader
        title={t("feedback.spendingTitle")}
        intro={t("feedback.spendingIntro")}
        back="/plan"
      />

      <Section>
        <div className="space-y-4">
          <Field label={t("spending.what")} htmlFor="label" error={error ?? undefined}>
            <TextInput
              id="label"
              value={label}
              maxLength={60}
              aria-invalid={!!error}
              placeholder={t("common.name")}
              onChange={(e) => setLabel(e.target.value)}
            />
          </Field>
          <div className="flex flex-wrap items-end gap-2">
            <div className="w-40">
              <Field label={t("common.amount")} htmlFor="amount">
                <MoneyInput id="amount" value={amount} onValueChange={setAmount} placeholder="0" />
              </Field>
            </div>
            <Button onClick={add}>{t("common.add")}</Button>
          </div>
        </div>
      </Section>

      {items.length === 0 ? (
        <Section>
          <EmptyState
            title={t("spending.emptyTitle")}
            body={t("spending.emptyBody")}
            action={
              <Button
                size="sm"
                variant="secondary"
                onClick={() => update((d) => ({ ...d, spending: demoData().spending }))}
              >
                {t("spending.loadDemo")}
              </Button>
            }
          />
        </Section>
      ) : (
        <>
          <Section>
            <dl className="grid grid-cols-3 gap-4 border-y border-border py-5">
              <Stat label={t("spending.total")} value={money(total)} size="sm" />
              <Stat label={t("spending.need")} value={money(sum("need"))} tone="safe" size="sm" />
              <Stat
                label={t("spending.want")}
                value={money(sum("want"))}
                tone="caution"
                size="sm"
              />
            </dl>
            <div
              className="mt-4 flex h-3 overflow-hidden rounded-full bg-surface-sunk"
              role="img"
              aria-label={t("spending.result", { pct: pct("want") })}
            >
              <div className="bg-safe" style={{ width: `${pct("need")}%` }} />
              <div className="bg-caution" style={{ width: `${pct("want")}%` }} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("spending.resultNeeds", { pct: pct("need") })}{" "}
              {t("spending.result", { pct: pct("want") })}
            </p>
            {unsorted > 0 && (
              <p className="mt-1 text-sm font-medium">{t("spending.unsorted", { n: unsorted })}</p>
            )}
          </Section>

          <Section title={t("feedback.spendingAction")}>
            <div className="grid gap-5 sm:grid-cols-3">
              {(["need", "want", "unsure"] as const).map((category) => (
                <div key={category} className="border-t-2 border-primary/30 pt-3">
                  <h3 className="font-medium">
                    {t(
                      category === "need"
                        ? "feedback.spendingProtect"
                        : category === "want"
                          ? "feedback.spendingDefer"
                          : "feedback.spendingClarify",
                    )}
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {items
                      .filter((i) => i.category === category)
                      .sort((a, b) => b.amount - a.amount)
                      .slice(0, 3)
                      .map((item) => (
                        <li key={item.id} className="text-sm">
                          {item.label}: {money(item.amount)}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
            <Field label={t("feedback.spendingReduction")} htmlFor="spending-reduction">
              <input
                id="spending-reduction"
                className="mt-5 h-11 w-full accent-primary"
                type="range"
                min={0}
                max={100}
                step={5}
                value={reduction}
                onChange={(e) => setReduction(Number(e.target.value))}
              />
            </Field>
            <p aria-live="polite" className="mt-3 text-sm font-medium">
              {sum("want") > 0
                ? t("feedback.spendingCut", {
                    pct: reduction,
                    amount: money(spendingReview(items, reduction)),
                  })
                : t("feedback.spendingNoWants")}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {t("feedback.spendingNote")}
            </p>
          </Section>
          <Section title={t("spending.classify")}>
            <ul className="divide-y divide-border border-y border-border">
              {items.map((s) => (
                <li key={s.id} className="py-3.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-medium">{s.label}</span>
                    <span className="num shrink-0 font-semibold">{money(s.amount)}</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <Segmented<SpendCategory>
                        label={`${t("spending.classify")}: ${s.label}`}
                        value={s.category}
                        onChange={(category) =>
                          update((d) => ({
                            ...d,
                            spending: d.spending.map((x) =>
                              x.id === s.id ? { ...x, category } : x,
                            ),
                          }))
                        }
                        options={[
                          { value: "need", label: t("spending.need") },
                          { value: "want", label: t("spending.want") },
                          { value: "unsure", label: t("spending.unsure") },
                        ]}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      type="button"
                      aria-label={`${t("common.delete")} ${s.label}`}
                      onClick={() =>
                        update((d) => ({ ...d, spending: d.spending.filter((x) => x.id !== s.id) }))
                      }
                      className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-danger"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}

      <Section>
        <Note tone="neutral">{t("common.disclaimer")}</Note>
      </Section>
    </Page>
  );
}
