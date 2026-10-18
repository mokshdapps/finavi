import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Upload, Trash2, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { useStore, migrate } from "@/lib/store";
import type { AppData } from "@/lib/store";
import { PageHeader } from "@/components/AppShell";
import { Button, Note, Page, Section, Segmented } from "@/components/ui-kit";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Settings - Language, privacy, and your data | Finavi" },
      {
        name: "description",
        content:
          "Switch between English and Spanish, export or import your data as a file, load example data, or erase everything stored on this device.",
      },
      { property: "og:title", content: "Finavi settings" },
      {
        property: "og:description",
        content: "Language, privacy, and full control of the data stored in your browser.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const { data, replace, reset, loadDemo, recoveryData } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmErase, setConfirmErase] = useState(false);
  const [pending, setPending] = useState<AppData | "demo" | null>(null);

  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify({ ...data, exportedAt: new Date().toISOString() }, null, 2)],
      {
        type: "application/json",
      },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finavi-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("settings.exported"));
  };

  const importData = async (file: File) => {
    try {
      if (file.size > 10_000_000) throw new Error("File too large");
      const parsed: unknown = JSON.parse(await file.text());
      if (typeof parsed !== "object" || parsed === null || !("emergency" in parsed))
        throw new Error("Invalid backup");
      const normalized = migrate(parsed);
      setPending({ ...normalized, onboarded: true });
    } catch {
      toast.error(t("settings.importError"));
    }
  };

  const erase = () => {
    reset();
    setConfirmErase(false);
    toast.success(t("settings.erased"));
  };

  return (
    <Page>
      <PageHeader title={t("settings.title")} back="/" />

      <Section title={t("settings.language")}>
        <Segmented<Lang>
          label={t("settings.language")}
          value={lang}
          onChange={setLang}
          options={[
            { value: "en", label: "English" },
            { value: "es", label: "Español" },
          ]}
        />
      </Section>

      <Section title={t("settings.privacy")}>
        <p className="text-[0.95rem] leading-relaxed text-foreground/85">
          {t("settings.privacyBody")}
        </p>
      </Section>

      <Section title={t("settings.data")}>
        {recoveryData && (
          <Button
            variant="secondary"
            className="mb-4"
            onClick={() => {
              const blob = new Blob([recoveryData], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "finavi-recovery.json";
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="size-4" />
            {t("upgrade.recover")}
          </Button>
        )}
        {pending && (
          <div
            role="alertdialog"
            aria-label={t("upgrade.replaceConfirm")}
            className="mb-5 border-y border-border py-4"
          >
            <Note tone="caution" title={t("upgrade.replaceConfirm")}>
              {t("upgrade.backup")}
            </Note>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={exportData}>
                <Download className="size-4" />
                {t("settings.export")}
              </Button>
              <Button
                onClick={() => {
                  if (pending === "demo") loadDemo();
                  else replace(pending);
                  setPending(null);
                  toast.success(t("settings.imported"));
                }}
              >
                {t("upgrade.confirmReplace")}
              </Button>
              <Button variant="ghost" onClick={() => setPending(null)}>
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={exportData} className="sm:flex-1">
            <Download className="size-4" aria-hidden />
            {t("settings.export")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => fileRef.current?.click()}
            className="sm:flex-1"
          >
            <Upload className="size-4" aria-hidden />
            {t("settings.import")}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importData(f);
              e.target.value = "";
            }}
          />
        </div>

        <div className="mt-5 border-t border-border pt-5">
          {confirmErase ? (
            <div>
              <Note tone="danger">{t("settings.eraseConfirm")}</Note>
              <div className="mt-3 flex gap-2">
                <Button variant="danger" onClick={erase}>
                  <Trash2 className="size-4" aria-hidden />
                  {t("settings.erase")}
                </Button>
                <Button variant="ghost" onClick={() => setConfirmErase(false)}>
                  {t("common.cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="danger" onClick={() => setConfirmErase(true)}>
              <Trash2 className="size-4" aria-hidden />
              {t("settings.erase")}
            </Button>
          )}
        </div>
      </Section>

      <Section title={t("settings.demo")} description={t("settings.demoBody")}>
        <Button variant="secondary" onClick={() => setPending("demo")}>
          <Sparkles className="size-4" aria-hidden />
          {data.demo ? t("settings.demoReset") : t("settings.demoOn")}
        </Button>
      </Section>

      <Button asChild variant="secondary" className="mt-7">
        <Link to="/help">{t("feedback.evidence")}</Link>
      </Button>
      <Section title={t("settings.about")}>
        <p className="text-[0.95rem] leading-relaxed text-foreground/85">
          {t("settings.aboutBody")}
        </p>
      </Section>

      <Section title={t("settings.important")}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("settings.importantBody")}
        </p>
      </Section>
    </Page>
  );
}
