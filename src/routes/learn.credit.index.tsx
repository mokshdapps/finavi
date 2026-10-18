import { createFileRoute } from "@tanstack/react-router";
import { CreditCourse } from "@/components/workspace/CreditCourse";

export const Route = createFileRoute("/learn/credit/")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Credit 101 - A 22-lesson course on scores, reports, and building credit | Finavi" },
      {
        name: "description",
        content:
          "Five units and 22 short lessons: what a score measures, the five scoring factors, building from zero with a secured card, protecting your report, and using credit without getting trapped.",
      },
      { property: "og:title", content: "Credit 101 course - Finavi" },
      {
        property: "og:description",
        content: "A free 22-lesson credit course in English and Spanish. No accounts, no tracking.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CreditCourse,
});
