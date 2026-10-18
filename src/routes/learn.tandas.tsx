import { createFileRoute } from "@tanstack/react-router";
import { TandaLearn } from "@/components/workspace/TandaLearn";

export const Route = createFileRoute("/learn/tandas")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "How tandas work - Risks and payout timing explained | Finavi" },
      {
        name: "description",
        content:
          "A tanda moves money between neighbors, it doesn't grow it. Learn what an early versus late payout position really means and what to check before joining a circle.",
      },
      { property: "og:title", content: "How tandas work - Finavi" },
      {
        property: "og:description",
        content: "Savings circles explained plainly: timing, trust, and what they can't do.",
      },
    ],
  }),
  component: TandaLearn,
});
