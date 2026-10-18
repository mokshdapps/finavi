import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { Wordmark } from "@/components/Logo";
import { Button } from "@/components/ui-kit";
import { WalkthroughVideo } from "@/components/WalkthroughVideo";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/walkthrough")({
  head: () => ({
    meta: [
      { title: "Finavi walkthrough - See your money plan in action" },
      {
        name: "description",
        content:
          "Watch a short bilingual example of Finavi, then continue to your private money plan.",
      },
      { property: "og:title", content: "Finavi walkthrough" },
      {
        property: "og:description",
        content:
          "A short English and Spanish introduction to private financial planning with Finavi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Walkthrough,
});

function Walkthrough() {
  const { t, lang, setLang } = useI18n();
  const { data } = useStore();
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-7 sm:px-8 sm:py-10">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <Wordmark />
        <div className="flex shrink-0 gap-1">
          {(["en", "es"] as const).map((language) => (
            <Button
              key={language}
              variant="ghost"
              aria-pressed={lang === language}
              onClick={() => setLang(language)}
              className={lang === language ? "bg-primary-soft text-primary-strong" : ""}
            >
              {language.toUpperCase()}
            </Button>
          ))}
        </div>
      </header>
      {data.onboarded && (
        <Button asChild variant="ghost" className="mt-5 px-0">
          <Link to="/">
            <ArrowLeft className="size-4" />
            {t("nav.back")}
          </Link>
        </Button>
      )}
      <h1 className="mt-8 text-3xl leading-tight sm:text-4xl">{t("journey.videoStep")}</h1>
      <p className="mt-3 mb-6 text-base leading-relaxed text-muted-foreground">
        {t("journey.videoBody")}
      </p>
      <WalkthroughVideo />
      <ol className="mt-5 divide-y divide-border border-y border-border">
        {(["preempt", "maximize", "supportAction"] as const).map((key, index) => (
          <li key={key} className="flex items-center gap-3 py-3 text-sm">
            <span className="num flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
              {index + 1}
            </span>
            {t(`journey.${key}`)}
          </li>
        ))}
      </ol>
      <section className="mt-5 border-l-3 border-safe bg-safe-soft px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="size-4 text-safe" />
          {t("feedback.privacyTitle")}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {t("feedback.privacyBody")}{" "}
          <Link to="/privacy" className="font-medium text-safe underline">
            {t("journey.privacyLink")}
          </Link>
        </p>
      </section>
      <div className="mt-7 grid gap-2 sm:flex sm:items-center sm:justify-between">
        <Button asChild size="lg">
          <Link to={data.onboarded ? "/" : "/welcome"}>
            {t(data.onboarded ? "journey.continue" : "journey.setupContinue")}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to={data.onboarded ? "/" : "/welcome"}>{t("journey.skip")}</Link>
        </Button>
      </div>
    </main>
  );
}
