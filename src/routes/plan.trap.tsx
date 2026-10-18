import { createFileRoute } from "@tanstack/react-router";
import { TrapPage } from "@/components/workspace/TrapPage";

export const Route = createFileRoute("/plan/trap")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Trap Detector - What a loan or advance really costs | Finavi" },
      {
        name: "description",
        content:
          "Pick how your loan is written - flat fee, fixed payments, revolving balance, or rent-to-own - and see the real annual rate, the total you repay, and what a 24% credit union loan would have cost instead.",
      },
      { property: "og:title", content: "Trap Detector - Finavi" },
      {
        property: "og:description",
        content: "Turn a small fee into the number lenders don't advertise: the yearly rate.",
      },
    ],
  }),
  component: TrapPage,
});
