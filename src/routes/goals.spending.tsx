import { createFileRoute } from "@tanstack/react-router";
import { SpendingPage } from "@/components/workspace/SpendingPage";

export const Route = createFileRoute("/goals/spending")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Spending analyzer - Protect essentials and compare cuts | Finavi" },
      {
        name: "description",
        content:
          "Write down recent purchases and sort them into needs, wants, and not sure. There is no right ratio; this is for reflection, not judgement.",
      },
      { property: "og:title", content: "Spending analyzer - Finavi" },
      {
        property: "og:description",
        content: "Sort recent purchases and see the pattern for yourself.",
      },
    ],
  }),
  component: SpendingPage,
});
