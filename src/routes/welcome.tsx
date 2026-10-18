import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore, uid } from "@/lib/store";
import { Button, Field, TextInput, MoneyInput } from "@/components/ui-kit";
import { Wordmark } from "@/components/Logo";
import { BrandIcon } from "@/components/BrandIcon";
export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome to Finavi - Private planning for seasonal income" },
      {
        name: "description",
        content:
          "Choose English or Spanish and start a private money plan or editable example in one step.",
      },
      { property: "og:title", content: "Welcome to Finavi" },
      {
        property: "og:description",
        content:
          "Seasonal budgeting, loan checks, tandas and Washington benefits without an account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Welcome,
});
function Welcome() {
  const { t, lang, setLang } = useI18n();
  const { update, loadDemo, ready } = useStore();
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [custom, setCustom] = useState("");
  const [cash, setCash] = useState<number | null>(null);
  const [protectedCash, setProtectedCash] = useState<number | null>(null);
  const options = [
    { key: "goalCar", icon: "wallet" },
    { key: "goalCelebration", icon: "sun" },
    { key: "goalHome", icon: "home" },
    { key: "goalOther", icon: "jar" },
  ] as const;
  const finish = () => {
    if (!ready) return;
    const name =
      goal === "goalOther"
        ? custom.trim()
        : goal
          ? t(`feedback.${goal as "goalCar" | "goalCelebration" | "goalHome"}`)
          : "";
    update((d) => ({
      ...d,
      onboarded: true,
      moneyPlan: {
        ...d.moneyPlan,
        cash: cash ?? d.moneyPlan.cash,
        protected: protectedCash ?? d.moneyPlan.protected,
      },
      jars: name
        ? [
            ...d.jars,
            {
              id: uid(),
              name,
              target: null,
              amount: 0,
              archived: false,
              createdAt: new Date().toISOString(),
            },
          ]
        : d.jars,
    }));
    router.navigate({ to: "/" });
  };
  return (
    <div className="mx-auto max-w-2xl px-5 py-7 sm:px-8">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <Wordmark />
        <div className="flex shrink-0 gap-1">
          {(["en", "es"] as const).map((l) => (
            <Button
              key={l}
              variant="ghost"
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
              className={lang === l ? "bg-primary-soft text-primary-strong" : ""}
            >
              {l.toUpperCase()}
            </Button>
          ))}
        </div>
      </header>
      <Button asChild variant="ghost" className="mt-5 px-0">
        <Link to="/walkthrough">
          <ArrowLeft className="size-4" />
          {t("journey.replay")}
        </Link>
      </Button>
      <section className="brand-greeting mt-5">
        <h1 className="text-3xl leading-tight sm:text-4xl">{t("journey.yourInfo")}</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">{t("journey.yourInfoBody")}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label={t("journey.cashToday")} htmlFor="setup-cash">
            <MoneyInput id="setup-cash" value={cash} onValueChange={setCash} placeholder="0" />
          </Field>
          <Field label={t("journey.protected")} htmlFor="setup-protected">
            <MoneyInput
              id="setup-protected"
              value={protectedCash}
              onValueChange={setProtectedCash}
              placeholder="0"
            />
          </Field>
        </div>
      </section>
      <section className="mt-6">
        <h2 className="text-sm font-medium">{t("feedback.goalOptional")}</h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {options.map((o) => (
            <Button
              key={o.key}
              variant="secondary"
              aria-pressed={goal === o.key}
              className={goal === o.key ? "border-primary bg-primary-soft" : ""}
              onClick={() => setGoal(goal === o.key ? "" : o.key)}
            >
              <BrandIcon name={o.icon} className="size-5" />
              {t(`feedback.${o.key}`)}
            </Button>
          ))}
        </div>
        {goal === "goalOther" && (
          <div className="mt-3">
            <Field label={t("jars.name")} htmlFor="welcome-goal">
              <TextInput
                id="welcome-goal"
                value={custom}
                maxLength={60}
                onChange={(e) => setCustom(e.target.value)}
              />
            </Field>
          </div>
        )}
      </section>
      <section className="mt-6 border-l-3 border-safe bg-safe-soft px-4 py-3">
        <h2 className="flex items-center gap-2 font-medium">
          <ShieldCheck className="size-5 shrink-0 text-safe" />
          {t("feedback.privacyTitle")}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {t("feedback.privacyBody")}{" "}
          <Link to="/privacy" className="font-medium text-safe underline">
            {t("journey.privacyLink")}
          </Link>
        </p>
      </section>
      <div className="mt-6 grid gap-2">
        <Button size="lg" full onClick={finish} disabled={!ready}>
          {t("feedback.start")}
        </Button>
        <Button
          full
          variant="secondary"
          disabled={!ready}
          onClick={() => {
            loadDemo();
            router.navigate({ to: "/" });
          }}
        >
          {t("feedback.demo")}
        </Button>
      </div>
    </div>
  );
}
