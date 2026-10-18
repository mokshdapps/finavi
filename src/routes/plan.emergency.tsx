import { createFileRoute } from "@tanstack/react-router";
import { EmergencyPage } from "@/components/workspace/EmergencyPage";

export const Route = createFileRoute("/plan/emergency")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "First $500 - Your starter emergency cushion | Finavi" },
      {
        name: "description",
        content:
          "A $500 cushion covers most car repairs, a missed shift, or a medical bill. Track what you've set aside, add or take out, and set a new target once you get there.",
      },
      { property: "og:title", content: "First $500 - Finavi" },
      {
        property: "og:description",
        content: "The cushion that keeps a small emergency from becoming a 391% loan.",
      },
    ],
  }),
  component: EmergencyPage,
});
