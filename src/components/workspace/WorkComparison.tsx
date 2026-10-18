import { ArrowRightLeft } from "lucide-react";
import { useI18n, type TKey } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { offerTakeHome, type WorkOffer } from "@/lib/money-plan";
import { PageHeader } from "@/components/AppShell";
import {
  Field,
  MoneyInput,
  Note,
  Page,
  PercentInput,
  Section,
  Stat,
  TextInput,
} from "@/components/ui-kit";
export function WorkComparison() {
  const { t, money } = useI18n();
  const { data, update } = useStore();
  const results = data.workOffers.map(offerTakeHome);
  const a = results[0];
  const b = results[1];
  const diff =
    a?.hourly !== null && b?.hourly !== null && a?.hourly !== undefined && b?.hourly !== undefined
      ? a.hourly - b.hourly
      : null;
  const patch = (index: number, key: keyof WorkOffer, value: number) =>
    update((d) => ({
      ...d,
      workOffers: d.workOffers.map((offer, i) =>
        i === index ? { ...offer, [key]: value } : offer,
      ) as [WorkOffer, WorkOffer],
    }));
  const fields: { key: keyof WorkOffer; label: TKey; type: "money" | "hours" | "pct" }[] = [
    { key: "gross", label: "upgrade.gross", type: "money" },
    { key: "hours", label: "upgrade.hours", type: "hours" },
    { key: "unpaid", label: "upgrade.unpaid", type: "hours" },
    { key: "costs", label: "upgrade.expenses", type: "money" },
    { key: "taxPct", label: "upgrade.tax", type: "pct" },
  ];
  return (
    <Page>
      <PageHeader title={t("upgrade.work")} intro={t("upgrade.workSub")} back="/plan" />
      <div className="mt-7 grid gap-8 sm:grid-cols-2">
        {data.workOffers.map((offer, index) => {
          const result = results[index];
          return (
            <section key={index} className="border-t-2 border-primary pt-4">
              <h2 className="mb-5 text-xl font-semibold">
                {t(index === 0 ? "upgrade.offerA" : "upgrade.offerB")}
              </h2>
              <div className="grid gap-4">
                {fields.map((field) => {
                  const id = `offer-${index}-${field.key}`;
                  return (
                    <Field key={field.key} label={t(field.label)} htmlFor={id}>
                      {field.type === "money" ? (
                        <MoneyInput
                          id={id}
                          value={offer[field.key] || null}
                          onValueChange={(v) => patch(index, field.key, v ?? 0)}
                        />
                      ) : field.type === "pct" ? (
                        <PercentInput
                          id={id}
                          value={offer.taxPct}
                          onValueChange={(v) => patch(index, field.key, Math.min(100, v ?? 0))}
                        />
                      ) : (
                        <TextInput
                          id={id}
                          type="number"
                          min="0"
                          max="10000"
                          step="0.25"
                          value={offer[field.key] || ""}
                          onChange={(e) =>
                            patch(index, field.key, Math.max(0, Number(e.target.value) || 0))
                          }
                        />
                      )}
                    </Field>
                  );
                })}
              </div>
              {result && (
                <dl className="mt-6 grid gap-4 border-y border-border py-5">
                  <Stat
                    label={t("upgrade.hourly")}
                    value={result.hourly === null ? "-" : money(result.hourly, true)}
                    tone={result.net < 0 ? "danger" : "primary"}
                    size="lg"
                  />
                  <Stat label={t("upgrade.net")} value={money(result.net, true)} size="sm" />
                </dl>
              )}
              {result && result.net < 0 && (
                <div className="mt-3">
                  <Note tone="danger">{t("upgrade.cashLoss")}</Note>
                </div>
              )}
            </section>
          );
        })}
      </div>
      <Section>
        <Note tone={diff === null ? "neutral" : "safe"}>
          <div className="flex gap-3">
            <ArrowRightLeft className="mt-0.5 size-5 shrink-0" />
            <p>
              {diff === null
                ? t("upgrade.workEmpty")
                : Math.abs(diff) < 0.005
                  ? t("upgrade.tie")
                  : t("upgrade.winner", {
                      offer: t(diff > 0 ? "upgrade.offerA" : "upgrade.offerB"),
                      amount: money(Math.abs(diff), true),
                    })}
            </p>
          </div>
        </Note>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {t("upgrade.workNote")}
        </p>
      </Section>
    </Page>
  );
}
