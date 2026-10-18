import { createFileRoute } from "@tanstack/react-router";
import { JarsPage } from "@/components/workspace/JarsPage";

export const Route = createFileRoute("/goals/jars")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Dream Jars - Save toward what matters | Finavi" },
      {
        name: "description",
        content:
          "A jar is just a name and an amount: a used car, a security deposit, work tools, a quinceañera. Add money, watch progress, all stored on your device.",
      },
      { property: "og:title", content: "Dream Jars - Finavi" },
      {
        property: "og:description",
        content: "Name what you're saving for, then watch it fill up.",
      },
    ],
  }),
  component: JarsPage,
});
