import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Settings, ArrowLeft, CircleHelp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Wordmark } from "./Logo";
import { cn } from "@/lib/utils";
import { Button } from "./ui-kit";

export function AppShell({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const { data, storageError, update, reset } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-background print:hidden">
        <div className="mx-auto grid min-h-16 w-full max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 pt-[env(safe-area-inset-top)] sm:px-8">
          <Link
            to="/"
            search={{ task: undefined }}
            className="flex min-w-0 items-center rounded-sm"
            aria-label="Finavi"
          >
            <Wordmark />
          </Link>

          <div className="flex shrink-0 items-center gap-1">
            <div
              className="flex overflow-hidden rounded-md border border-border"
              aria-label={t("settings.language")}
            >
              {(["en", "es"] as const).map((l) => (
                <Button
                  variant="ghost"
                  size="sm"
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={cn(
                    "h-11 min-h-11 rounded-none px-2.5 text-xs font-semibold uppercase transition-colors",
                    lang === l
                      ? "bg-foreground text-background hover:bg-foreground hover:text-background"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {l}
                </Button>
              ))}
            </div>
            <Link
              to="/help"
              aria-label={t("feedback.evidence")}
              className="flex size-11 items-center justify-center text-muted-foreground"
            >
              <CircleHelp className="size-5" />
            </Link>
            <Link
              to="/settings"
              aria-label={t("nav.settings")}
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-muted",
                pathname === "/settings" ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Settings className="size-5" />
            </Link>
          </div>
        </div>
        {data.demo && (
          <div className="border-t border-primary/20 bg-primary-soft px-5 py-3">
            <div className="mx-auto max-w-4xl">
              <p className="text-xs leading-relaxed text-primary-strong">
                {t("feedback.demoBody")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => update((d) => ({ ...d, demo: false }))}
                >
                  {t("feedback.demoKeep")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (window.confirm(t("feedback.demoConfirm"))) reset();
                  }}
                >
                  {t("feedback.demoExit")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {storageError && (
        <div
          role="alert"
          className="border-b border-danger/25 bg-danger-soft px-5 py-3 text-center text-sm text-danger"
        >
          {t(storageError === "read" ? "upgrade.readError" : "upgrade.storageError")}{" "}
          <Link to="/settings" className="font-semibold underline">
            {t("nav.settings")}
          </Link>
        </div>
      )}
      <main
        id="main-content"
        className="min-w-0 flex-1 pb-[calc(2rem+env(safe-area-inset-bottom))]"
      >
        {children}
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  intro,
  back,
  right,
}: {
  title: string;
  intro?: string;
  back?: string;
  right?: ReactNode;
}) {
  const { t } = useI18n();
  const router = useRouter();
  return (
    <div className="brand-greeting pt-5">
      {back && (
        <Link
          to={back}
          onClick={(event) => {
            if (
              !event.metaKey &&
              !event.ctrlKey &&
              !event.shiftKey &&
              !event.altKey &&
              router.history.canGoBack()
            ) {
              event.preventDefault();
              router.history.back();
            }
          }}
          className="-ml-1 mb-3 inline-flex min-h-11 items-center gap-1.5 rounded-md pr-2 pl-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t("nav.back")}
        </Link>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:justify-between sm:gap-4">
        <h1 className="min-w-0 break-words text-[1.6rem] leading-tight sm:text-3xl">{title}</h1>
        {right && <div className="shrink-0">{right}</div>}
      </div>
      {intro && <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">{intro}</p>}
    </div>
  );
}
