import { createFileRoute } from "@tanstack/react-router";
import { HomeJourney } from "@/components/HomeJourney";
import { parseHomeTask, type HomeTaskId } from "@/data/home-tasks";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { task?: HomeTaskId | undefined } => ({
    task: parseHomeTask(search["task"]),
  }),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Finavi - A money plan for income that changes" },
      {
        name: "description",
        content:
          "Finavi helps you budget for changing income, check benefits and loan costs, and track your savings while keeping your financial information on your device.",
      },
      { property: "og:title", content: "Finavi - A money plan for income that changes" },
      {
        property: "og:description",
        content:
          "Finavi helps you budget for changing income, check benefits and loan costs, and track your savings while keeping your financial information on your device.",
      },
    ],
  }),
  component: HomeJourney,
});
