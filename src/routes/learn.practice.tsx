import { createFileRoute } from "@tanstack/react-router";
import { MoneyPractice } from "@/components/workspace/MoneyPractice";

export const Route = createFileRoute("/learn/practice")({
  head: () => ({
    meta: [
      { title: "Money in real life | Finavi" },
      {
        name: "description",
        content:
          "Practice everyday decisions about irregular income, gig pay, loan costs, credit, and savings circles. Bilingual and private.",
      },
      { property: "og:title", content: "Money in real life | Finavi" },
      {
        property: "og:description",
        content: "Practice real financial decisions with immediate explanations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MoneyPractice,
});
