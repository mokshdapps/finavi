import { createFileRoute } from "@tanstack/react-router";
import { WorkComparison } from "@/components/workspace/WorkComparison";

export const Route = createFileRoute("/plan/work")({
  head: () => ({
    meta: [
      { title: "Work offer comparison | Finavi" },
      {
        name: "description",
        content:
          "Compare gig and hourly job offers after expenses, unpaid travel time, and a chosen tax reserve. Your numbers stay on this device.",
      },
      { property: "og:title", content: "Work offer comparison | Finavi" },
      {
        property: "og:description",
        content: "See the true hourly take-home behind two work offers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkComparison,
});
