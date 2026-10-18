import { createFileRoute } from "@tanstack/react-router";
import { BenefitsPage } from "@/components/workspace/BenefitsPage";

export const Route = createFileRoute("/plan/benefits")({
  head: () => ({
    meta: [
      { title: "Washington benefits - Seasonal household guidance | Finavi" },
      {
        name: "description",
        content:
          "Review Washington food, health, child-care and household assistance with explained questions, income scenarios and official agency links.",
      },
      { property: "og:title", content: "Washington benefits guidance | Finavi" },
      {
        property: "og:description",
        content:
          "Private household guidance with clear income assumptions and official sources, not a benefits determination.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BenefitsPage,
});
