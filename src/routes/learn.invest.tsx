import { createFileRoute } from "@tanstack/react-router";
import { InvestPage } from "@/components/workspace/InvestPage";

export const Route = createFileRoute("/learn/invest")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Practice portfolio - Investing simulator with no real money | Finavi" },
      {
        name: "description",
        content:
          "Buy and sell sample funds with practice cash, advance a year at a time, and see why one company swings far more than a fund holding hundreds.",
      },
      { property: "og:title", content: "Practice portfolio - Finavi" },
      {
        property: "og:description",
        content: "No brokerage, no account, no real money. Just how investing behaves.",
      },
    ],
  }),
  component: InvestPage,
});
