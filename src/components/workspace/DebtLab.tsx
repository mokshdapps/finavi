import { DebtPriorities } from "@/components/DebtPriorities";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { debtPayoff } from "@/lib/debt-payoff";
import { PageHeader } from "@/components/AppShell";
import {
  Button,
  Field,
  MoneyInput,
  Note,
  Page,
  Section,
  Stat,
  TextInput,
} from "@/components/ui-kit";

export function DebtLab() {
  const { t, money } = useI18n();
  const [balance, setBalance] = useState<number | null>(null);
  const [apr, setApr] = useState(0);
  const [payment, setPayment] = useState<number | null>(null);
  const [extra, setExtra] = useState<number | null>(0);
  const [visible, setVisible] = useState(12);
  const base = debtPayoff(balance ?? 0, apr, payment ?? 0);
  const faster = debtPayoff(balance ?? 0, apr, (payment ?? 0) + (extra ?? 0));
  const ready = (balance ?? 0) > 0 && (payment ?? 0) > 0;
  return (
    <Page>
      <PageHeader title={t("connected.debt")} intro={t("connected.debtSub")} back="/plan" />
      <DebtPriorities />
      <section className="mt-7 grid gap-5 border-y border-border py-5 sm:grid-cols-2">
        <Field label={t("connected.balance")} htmlFor="debt-balance">
          <MoneyInput id="debt-balance" value={balance} onValueChange={setBalance} />
        </Field>
        <Field label={t("connected.apr")} htmlFor="debt-apr">
          <TextInput
            id="debt-apr"
            type="number"
            min={0}
            max={1000}
            step="0.1"
            value={apr}
            onChange={(event) => setApr(Number(event.target.value))}
          />
        </Field>
        <Field label={t("connected.payment")} htmlFor="debt-payment">
          <MoneyInput id="debt-payment" value={payment} onValueChange={setPayment} />
        </Field>
        <Field label={t("connected.extra")} htmlFor="debt-extra">
          <MoneyInput id="debt-extra" value={extra} onValueChange={setExtra} />
        </Field>
      </section>
      {!ready ? (
        <p className="mt-6 text-muted-foreground">{t("connected.emptyDebt")}</p>
      ) : !base || !faster || (extra ?? 0) < 0 ? (
        <div className="mt-6">
          <Note tone="danger">{t("connected.rateError")}</Note>
        </div>
      ) : (
        <>
          <section className="mt-7 grid gap-6 sm:grid-cols-2" aria-live="polite">
            {[
              { result: base, title: "connected.base" as const },
              { result: faster, title: "connected.faster" as const },
            ].map(({ result, title }) => (
              <div key={title} className="border-t-2 border-primary pt-4">
                <h2 className="font-semibold">{t(title)}</h2>
                {result.never ? (
                  <p className="mt-3 text-sm leading-relaxed text-danger">
                    {t("connected.notPaying")}
                  </p>
                ) : (
                  <>
                    <p className="num mt-3 text-3xl font-semibold text-primary-strong">
                      {t("connected.months", { n: result.months })}
                    </p>
                    <dl className="mt-4 grid grid-cols-2 gap-3">
                      <Stat
                        label={t("connected.interest")}
                        value={money(result.interest)}
                        size="sm"
                      />
                      <Stat label={t("connected.total")} value={money(result.total)} size="sm" />
                    </dl>
                  </>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  {t("connected.firstInterest", { amount: money(result.firstInterest) })}
                </p>
              </div>
            ))}
          </section>
          {!base.never && !faster.never && (extra ?? 0) > 0 && (
            <div className="mt-6">
              <Note tone="safe">
                {t("connected.save", {
                  amount: money(base.interest - faster.interest),
                  n: base.months - faster.months,
                })}
              </Note>
            </div>
          )}
          {!faster.never && (
            <Section title={t("connected.schedule")}>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      {(
                        [
                          "connected.month",
                          "connected.payment",
                          "connected.monthlyInterest",
                          "connected.remaining",
                        ] as const
                      ).map((key) => (
                        <th key={key} className="px-2 py-3 font-medium first:pl-0 last:pr-0">
                          {t(key)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {faster.rows.slice(0, visible).map((row) => (
                      <tr key={row.month} className="border-b border-border">
                        <td className="num py-3">{row.month}</td>
                        <td className="num px-2">{money(row.payment)}</td>
                        <td className="num px-2">{money(row.interest)}</td>
                        <td className="num">{money(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {faster.rows.length > visible && (
                <Button
                  variant="ghost"
                  className="mt-3"
                  onClick={() => setVisible((count) => count + 12)}
                >
                  <ChevronDown className="size-4" />
                  {t("connected.more")}
                </Button>
              )}
            </Section>
          )}
        </>
      )}
      <p className="mt-7 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
        {t("connected.debtNote")}
      </p>
    </Page>
  );
}
