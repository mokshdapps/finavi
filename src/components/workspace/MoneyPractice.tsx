import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { moneyPractice } from "@/data/money-practice";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/AppShell";
import { Button, Meter, Note, Page, Section } from "@/components/ui-kit";
export function MoneyPractice() {
  const { t, lang } = useI18n();
  const { update } = useStore();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const situation = moneyPractice[index];
  return (
    <Page>
      <PageHeader title={t("upgrade.practice")} intro={t("upgrade.practiceSub")} back="/learn" />
      <Section>
        <Meter value={index} max={moneyPractice.length} label={t("upgrade.practice")} />
        {situation ? (
          <>
            <p className="mt-5 text-sm text-muted-foreground">
              {t("upgrade.quizProgress", { n: index + 1, total: moneyPractice.length })}
            </p>
            <h2 className="mt-3 text-xl leading-relaxed font-semibold">
              {situation.question[lang]}
            </h2>
            <fieldset className="mt-6 grid gap-3" disabled={checked}>
              <legend className="sr-only">{situation.question[lang]}</legend>
              {situation.options.map((option, i) => (
                <label
                  key={i}
                  className={`flex cursor-pointer items-start gap-3 rounded-md border px-4 py-4 ${selected === i ? "border-primary bg-primary-soft" : "border-border bg-surface"}`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={i}
                    checked={selected === i}
                    onChange={() => setSelected(i)}
                    className="mt-1 size-4 shrink-0 accent-primary"
                  />
                  <span className="leading-relaxed">{option[lang]}</span>
                </label>
              ))}
            </fieldset>
            {!checked ? (
              <Button
                className="mt-5"
                disabled={selected === null}
                onClick={() => {
                  setChecked(true);
                  if (selected === situation.correct) {
                    setScore((s) => s + 1);
                    update((d) => ({
                      ...d,
                      practiceCorrect: [...new Set([...d.practiceCorrect, situation.id])],
                    }));
                  }
                }}
              >
                {t("upgrade.check")}
              </Button>
            ) : (
              <div className="mt-5" aria-live="polite">
                <Note
                  tone={selected === situation.correct ? "safe" : "caution"}
                  title={t(selected === situation.correct ? "upgrade.correct" : "upgrade.tryAgain")}
                >
                  {situation.explanation[lang]}
                </Note>
                <Button
                  className="mt-5"
                  onClick={() => {
                    setIndex((i) => i + 1);
                    setChecked(false);
                    setSelected(null);
                  }}
                >
                  {t("upgrade.quizNext")}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <Check className="mx-auto size-10 text-safe" />
            <h2 className="mt-4 text-2xl font-semibold">{t("upgrade.quizDone")}</h2>
            <p className="mt-3 text-lg">
              {t("upgrade.quizResult", { n: score, total: moneyPractice.length })}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIndex(0);
                  setSelected(null);
                  setChecked(false);
                  setScore(0);
                }}
              >
                <RotateCcw className="size-4" />
                {t("upgrade.restart")}
              </Button>
              <Button asChild>
                <Link to="/plan/week">
                  {t("upgrade.viewPlan")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </Section>
    </Page>
  );
}
