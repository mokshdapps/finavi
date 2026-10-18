import { createFileRoute } from "@tanstack/react-router";
import { BudgetPage } from "@/components/workspace/BudgetPage";

export const Route = createFileRoute("/plan/budget")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { tab?: "year" | "bills" | "plan" | "tax" | "coach" } => ({
    tab:
      search["tab"] === "bills" ||
      search["tab"] === "plan" ||
      search["tab"] === "tax" ||
      search["tab"] === "coach"
        ? search["tab"]
        : "year",
  }),
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Harvest Budget - Turn a seasonal year into a steady paycheck | Finavi" },
      {
        name: "description",
        content:
          "Map your season month by month, set your survival number, pay yourself a steady paycheck from a reserve, set aside self-employment tax, and stress-test a bad season.",
      },
      { property: "og:title", content: "Harvest Budget - Finavi" },
      {
        property: "og:description",
        content:
          "Built for income that arrives in bursts: reserve planning, taxes, and lean-season math.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BudgetRoute,
});
function BudgetRoute() {
  const { tab = "year" } = Route.useSearch();
  return <BudgetPage key={tab} initialTab={tab} />;
}
