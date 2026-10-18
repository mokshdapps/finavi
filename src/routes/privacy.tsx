import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Button, Page, Section } from "@/components/ui-kit";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy and security | Finavi" },
      {
        name: "description",
        content:
          "How Finavi keeps financial entries on your device, without accounts or bank connections, and how to protect your saved plan.",
      },
      { property: "og:title", content: "Privacy and security | Finavi" },
      {
        property: "og:description",
        content:
          "Your financial entries stay on your device. Learn about browser storage, backups and keeping your plan private.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  const { t } = useI18n();
  const { data } = useStore();
  return (
    <Page>
      <Button asChild variant="ghost" className="mt-5 px-0">
        <Link to={data.onboarded ? "/" : "/walkthrough"}>
          <ArrowLeft className="size-4" />
          {t("nav.back")}
        </Link>
      </Button>
      <h1 className="mt-4 flex items-start gap-3 text-3xl">
        <ShieldCheck className="mt-1 size-7 shrink-0 text-safe" />
        {t("feedback.privacyTitle")}
      </h1>
      <Section>
        <p className="leading-relaxed">{t("settings.privacyBody")}</p>
      </Section>
      <Section>
        <ul className="divide-y divide-border border-y border-border">
          {(["p1", "p2", "p3", "p4"] as const).map((key) => (
            <li key={key} className="py-4 text-sm">
              {t(`onboarding.privacy.${key}`)}
            </li>
          ))}
        </ul>
      </Section>
      <Section title={t("settings.important")}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("settings.importantBody")}
        </p>
      </Section>
    </Page>
  );
}
