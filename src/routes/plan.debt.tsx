import { createFileRoute } from "@tanstack/react-router";
import { DebtLab } from "@/components/workspace/DebtLab";

export const Route = createFileRoute("/plan/debt")({
  head: () => ({
    meta: [
      { title: "Debt payoff lab | Finavi" },
      {
        name: "description",
        content:
          "Compare monthly debt payments, interest costs, and payoff dates with a private on-device payment schedule.",
      },
      { property: "og:title", content: "Debt payoff lab | Finavi" },
      {
        property: "og:description",
        content:
          "Compare monthly debt payments, interest costs, and payoff dates with a private on-device payment schedule.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DebtLab,
});
