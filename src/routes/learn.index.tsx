import { createFileRoute } from "@tanstack/react-router";
import { HomeJourney } from "@/components/HomeJourney";
import { parseHomeTask, type HomeTaskId } from "@/data/home-tasks";

export const Route = createFileRoute("/learn/")({
  validateSearch: (search: Record<string, unknown>): { task?: HomeTaskId | undefined } => ({
    task: parseHomeTask(search["task"]),
  }),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Learn - Credit, investing practice, and college aid | Finavi" },
      {
        name: "description",
        content:
          "Short modules on credit scores and secured cards, a no-money practice portfolio, how tandas work, and what Pell and Washington College Grant can cover.",
      },
      { property: "og:title", content: "Learn with Finavi" },
      {
        property: "og:description",
        content:
          "Credit 101, a practice investing simulator, tanda basics, and college aid: plain language, no jargon.",
      },
    ],
  }),
  component: LearnIndex,
});

function LearnIndex() {
  return <HomeJourney initialStage={3} />;
}
