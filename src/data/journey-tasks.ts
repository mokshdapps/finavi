import type { JourneyTaskId } from "@/lib/money-journey";

export const taskRoutes = {
  cash: "/plan/week",
  income: "/plan/budget",
  bills: "/plan/budget",
  spending: "/goals/spending",
  goal: "/goals/jars",
  credit: "/learn/credit",
} as const;

export const taskSearch = (id: JourneyTaskId) => (id === "bills" ? { tab: "bills" as const } : {});
