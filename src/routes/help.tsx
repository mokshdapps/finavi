import { WalkthroughVideo } from "@/components/WalkthroughVideo";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Share2, Download, ExternalLink, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/AppShell";
import { Button, Field, Page, Section, Segmented } from "@/components/ui-kit";
import { downloadText } from "@/lib/download";
type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Finavi help - Research, privacy and sharing" },
      {
        name: "description",
        content:
          "Learn why Finavi focuses on income timing, how to use it on a phone and how to share feedback without sending financial data.",
      },
      { property: "og:title", content: "Finavi help and research" },
      {
        property: "og:description",
        content: "Research, privacy, installation and optional feedback with clear limits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Help,
});
function Help() {
  const { t } = useI18n();
  const [install, setInstall] = useState<InstallPrompt | null>(null);
  const [kind, setKind] = useState<"bug" | "idea" | "access">("idea");
  const [note, setNote] = useState("");
  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstall(event as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: "Finavi", url: "https://gofinavi.com" });
      else {
        await navigator.clipboard.writeText("https://gofinavi.com");
        toast.success(t("feedback.shareCopied"));
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      toast.error(t("feedback.shareFailed"));
    }
  };
  return (
    <Page>
      <PageHeader title={t("feedback.helpTitle")} intro={t("feedback.helpIntro")} back="/" />
      {(["whyNow", "trust", "community"] as const).map((key) => (
        <Section
          key={key}
          title={t(
            key === "whyNow"
              ? "feedback.whyNow"
              : key === "trust"
                ? "feedback.trustTitle"
                : "feedback.communityTitle",
          )}
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t(`feedback.${key}Body`)}
          </p>
        </Section>
      ))}
      <Section title={t("feedback.researchTitle")}>
        <ul className="divide-y divide-border border-y border-border">
          {[
            {
              title: "Income volatility and saving decisions: Experimental evidence (2024)",
              url: "https://www.sciencedirect.com/science/article/pii/S221463502400056X",
            },
            {
              title: "Buffer-stock saving and households’ response to income shocks (2020)",
              url: "https://doi.org/10.1111/iere.12459",
            },
            {
              title:
                "Liquidity Constraints, Income Variance, and Buffer Stock Savings: Experimental Evidence (2025)",
              url: "https://doi.org/10.1111/iere.12784",
            },
          ].map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-start gap-2 py-4 text-sm text-primary-strong underline"
              >
                {source.title}
                <ExternalLink className="mt-0.5 size-4 shrink-0" />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {t("feedback.researchNote")}
        </p>
      </Section>
      <Section title={t("feedback.installTitle")}>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("feedback.installBody")}</p>
        {install && (
          <Button
            className="mt-3"
            onClick={async () => {
              await install.prompt();
              await install.userChoice;
              setInstall(null);
            }}
          >
            <Download className="size-4" />
            {t("feedback.installButton")}
          </Button>
        )}
      </Section>
      <Section title={t("feedback.shareTitle")}>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("feedback.shareBody")}</p>
        <Button className="mt-3" variant="secondary" onClick={share}>
          <Share2 className="size-4" />
          {t("feedback.shareButton")}
        </Button>
      </Section>
      <Section title={t("feedback.feedbackTitle")} description={t("feedback.feedbackBody")}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!note.trim()) return;
            downloadText(
              "finavi-feedback.txt",
              `Finavi\n${t("feedback.feedbackType")}: ${t(kind === "bug" ? "feedback.feedbackBug" : kind === "idea" ? "feedback.feedbackIdea" : "feedback.feedbackAccess")}\n\n${note.trim()}\n`,
            );
            toast.success(t("feedback.feedbackSuccess"));
            setNote("");
          }}
        >
          <Field label={t("feedback.feedbackType")}>
            <Segmented
              label={t("feedback.feedbackType")}
              value={kind}
              onChange={setKind}
              options={[
                { value: "bug", label: t("feedback.feedbackBug") },
                { value: "idea", label: t("feedback.feedbackIdea") },
                { value: "access", label: t("feedback.feedbackAccess") },
              ]}
            />
          </Field>
          <Field label={t("feedback.feedbackText")} htmlFor="feedback-text">
            <textarea
              id="feedback-text"
              className="min-h-28 w-full rounded-md border border-border-strong bg-surface p-3 text-base"
              value={note}
              maxLength={2000}
              required
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>
          <Button type="submit" variant="secondary">
            <MessageSquare className="size-4" />
            {t("feedback.feedbackDownload")}
          </Button>
        </form>
      </Section>
      <Section title={t("feedback.demoFlowTitle")}>
        <WalkthroughVideo />
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("feedback.demoFlowBody")}
        </p>
      </Section>
    </Page>
  );
}
