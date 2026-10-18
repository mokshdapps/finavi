import { createFileRoute } from "@tanstack/react-router";
import { HomeJourney } from "@/components/HomeJourney";
import { parseHomeTask, type HomeTaskId } from "@/data/home-tasks";

export const Route = createFileRoute("/goals/")({
  validateSearch: (search: Record<string, unknown>): { task?: HomeTaskId | undefined } => ({
    task: parseHomeTask(search["task"]),
  }),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Goals - Save for your family priorities | Finavi" },
      {
        name: "description",
        content:
          "Track savings goals for a car, home deposit or quinceañera, separately from your emergency cushion.",
      },
      { property: "og:title", content: "Your savings goals - Finavi" },
      {
        property: "og:description",
        content: "Savings goals for your family priorities, stored on your device.",
      },
    ],
  }),
  component: GoalsIndex,
});

function GoalsIndex() {
  return <HomeJourney initialStage={2} />;
}
