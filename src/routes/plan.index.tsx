import { createFileRoute } from "@tanstack/react-router";
import { HomeJourney } from "@/components/HomeJourney";
import { parseHomeTask, type HomeTaskId } from "@/data/home-tasks";

export const Route = createFileRoute("/plan/")({
  validateSearch: (search: Record<string, unknown>): { task?: HomeTaskId | undefined } => ({
    task: parseHomeTask(search["task"]),
  }),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Plan - Benefits, loan costs, and seasonal budgeting | Finavi" },
      {
        name: "description",
        content:
          "Screen for Washington benefits, check what a payday loan really costs, plan around income that rises and falls, and build a first $500 cushion.",
      },
      { property: "og:title", content: "Plan your money - Finavi" },
      {
        property: "og:description",
        content:
          "Benefits screening, loan cost checks, a seasonal income plan, and a starter emergency fund.",
      },
    ],
  }),
  component: PlanIndex,
});

function PlanIndex() {
  return <HomeJourney initialStage={0} />;
}
