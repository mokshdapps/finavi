import { createFileRoute } from "@tanstack/react-router";
import { WeeklyPlan } from "@/components/workspace/WeeklyPlan";

export const Route = createFileRoute("/plan/week")({
  head: () => ({
    meta: [
      { title: "Weekly money plan | Finavi" },
      {
        name: "description",
        content:
          "Plan upcoming pay dates and bills, protect a cash cushion, and see cash-flow gaps before they happen. Calculated privately on your device.",
      },
      { property: "og:title", content: "Weekly money plan | Finavi" },
      {
        property: "og:description",
        content: "A local cash-flow timeline for income that changes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WeeklyPlan,
});
