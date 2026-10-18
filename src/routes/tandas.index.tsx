import { createFileRoute } from "@tanstack/react-router";
import { TandasHub } from "@/components/workspace/TandasHub";

export const Route = createFileRoute("/tandas/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Tandas - Track your savings circles | Finavi" },
      {
        name: "description",
        content:
          "Track every savings circle you are in: rounds paid, money at risk, when your pot lands, and what your turn is worth compared to a payday loan.",
      },
      { property: "og:title", content: "Tandas - Finavi" },
      {
        property: "og:description",
        content: "Savings circles tracked round by round, stored only on your device.",
      },
    ],
  }),
  component: TandasHub,
});
