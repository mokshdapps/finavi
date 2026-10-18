import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportRuntimeError } from "../lib/report-error";
import { I18nProvider } from "@/lib/i18n";
import { StoreProvider, useStore } from "@/lib/store";
import { AppShell } from "@/components/AppShell";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="num text-5xl font-semibold text-primary">404</p>
        <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          That page doesn't exist. Nothing you've saved was affected.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-strong"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportRuntimeError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Your saved information is still on this device.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-strong"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border-strong bg-surface px-5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#F26A0F" },
      { title: "Finavi - A money plan for income that changes" },
      {
        name: "description",
        content:
          "Finavi helps you budget for changing income, check benefits and loan costs, and track your savings while keeping your financial information on your device.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function OnboardingGate({ children }: { children: ReactNode }) {
  const { data, ready, storageError } = useStore();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onWelcome = pathname === "/welcome";
  const onHelp = pathname === "/help";
  const onWalkthrough = pathname === "/walkthrough";
  const onPrivacy = pathname === "/privacy";
  const redirectTarget =
    !ready || storageError === "read"
      ? null
      : !data.onboarded && !onWelcome && !onHelp && !onWalkthrough && !onPrivacy
        ? "/walkthrough"
        : data.onboarded && onWelcome
          ? "/"
          : null;
  const blocking =
    !ready || (redirectTarget === "/walkthrough" && storageError !== "read" && !data.onboarded);

  useEffect(() => {
    if (redirectTarget) router.navigate({ to: redirectTarget, replace: true });
  }, [
    ready,
    data.onboarded,
    onWelcome,
    onWalkthrough,
    pathname,
    router,
    storageError,
    onHelp,
    onPrivacy,
    redirectTarget,
  ]);

  if (blocking) return <div className="min-h-dvh bg-background" aria-hidden="true" />;
  if (onWelcome || onWalkthrough || (!data.onboarded && onPrivacy)) return <>{children}</>;
  return <AppShell>{children}</AppShell>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <StoreProvider>
          <OnboardingGate>
            <Outlet />
          </OnboardingGate>
          <Toaster position="top-center" />
        </StoreProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
