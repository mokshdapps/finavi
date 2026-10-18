import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useStore, uid } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { allocateDebtPayments, validDebt } from "@/lib/debt-priority";
import { Button, Field, MoneyInput, Note, Section, Segmented, TextInput } from "./ui-kit";
export function DebtPriorities() {
  const { data, update } = useStore();
  const { t, money } = useI18n();
  const [label, setLabel] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [apr, setApr] = useState(0);
  const [minimum, setMinimum] = useState<number | null>(null);
  const [extra, setExtra] = useState<number | null>(0);
  const [method, setMethod] = useState<"avalanche" | "snowball">("avalanche");
  const [error, setError] = useState(false);
  const rows = allocateDebtPayments(data.debts, extra ?? 0, method);
  return (
    <Section title={t("feedback.debtOrder")} description={t("feedback.debtIntro")}>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          const debt = {
            id: uid(),
            label: label.trim(),
            balance: balance ?? 0,
            apr,
            minimum: minimum ?? 0,
          };
          if (!validDebt(debt)) {
            setError(true);
            return;
          }
          update((d) => ({ ...d, debts: [...d.debts, debt] }));
          setLabel("");
          setBalance(null);
          setMinimum(null);
          setError(false);
        }}
      >
        <Field label={t("feedback.debtLabel")} htmlFor="priority-label">
          <TextInput
            id="priority-label"
            value={label}
            maxLength={100}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
        </Field>
        <Field label={t("connected.balance")} htmlFor="priority-balance">
          <MoneyInput id="priority-balance" value={balance} onValueChange={setBalance} required />
        </Field>
        <Field label={t("connected.apr")} htmlFor="priority-apr">
          <TextInput
            id="priority-apr"
            type="number"
            value={apr}
            min={0}
            max={1000}
            step="0.1"
            onChange={(e) => setApr(Number(e.target.value))}
            required
          />
        </Field>
        <Field label={t("feedback.debtMinimum")} htmlFor="priority-minimum">
          <MoneyInput id="priority-minimum" value={minimum} onValueChange={setMinimum} required />
        </Field>
        {error && (
          <p role="alert" className="text-sm text-danger sm:col-span-2">
            {t("feedback.debtInvalid")}
          </p>
        )}
        <Button type="submit" className="justify-self-start">
          <Plus className="size-4" />
          {t("feedback.debtAdd")}
        </Button>
      </form>
      {!!data.debts.length && (
        <>
          <p className="mt-5 text-sm">
            {t("feedback.debtTotals", {
              amount: money(data.debts.reduce((s, d) => s + d.minimum, 0)),
            })}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={t("feedback.debtExtra")} htmlFor="priority-extra">
              <MoneyInput id="priority-extra" value={extra} onValueChange={setExtra} />
            </Field>
            <Field label={t("feedback.debtOrder")}>
              <Segmented
                value={method}
                onChange={setMethod}
                label={t("feedback.debtOrder")}
                options={[
                  { value: "avalanche", label: t("feedback.debtAvalanche") },
                  { value: "snowball", label: t("feedback.debtSnowball") },
                ]}
              />
            </Field>
          </div>
          <ol className="mt-4 divide-y divide-border border-y border-border">
            {rows.map((debt, i) => (
              <li
                key={debt.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4"
              >
                <div className="min-w-0">
                  <p className="break-words font-semibold">
                    {i + 1}. {debt.label}
                  </p>
                  <p className="num mt-1 text-sm text-muted-foreground">
                    {money(debt.balance)} · {debt.apr}% APR
                  </p>
                  <p className="num mt-2 text-sm">
                    {t("feedback.debtAllocation", {
                      minimum: money(debt.minimum),
                      extra: money(debt.extra),
                      total: money(debt.total),
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="size-11 px-0"
                  aria-label={`${t("common.delete")} ${debt.label}`}
                  title={t("common.delete")}
                  onClick={() =>
                    update((d) => ({ ...d, debts: d.debts.filter((x) => x.id !== debt.id) }))
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ol>
        </>
      )}
      <div className="mt-4">
        <Note tone="neutral">{t("feedback.debtNote")}</Note>
      </div>
    </Section>
  );
}
