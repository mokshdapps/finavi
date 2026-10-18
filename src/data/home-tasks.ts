import type { JourneyTaskId } from "@/lib/money-journey";

export const homeTaskIds = [
  "cash",
  "income",
  "bills",
  "spending",
  "goal",
  "credit",
  "cushion",
  "debt",
  "benefits",
  "trap",
  "work",
  "tanda",
  "invest",
  "practice",
  "tandaLearn",
  "college",
  "coach",
  "history",
  "reminders",
] as const;
export type HomeTaskId = (typeof homeTaskIds)[number];
export function parseHomeTask(value: unknown): HomeTaskId | undefined {
  return homeTaskIds.find((id) => id === value);
}
export const homeTaskTitles = {
  cash: "journey.action.cash",
  income: "journey.action.income",
  bills: "journey.action.bills",
  spending: "journey.action.spending",
  goal: "journey.action.goal",
  credit: "learn.credit",
  cushion: "journey.cushion",
  debt: "journey.debt",
  benefits: "journey.benefits",
  trap: "journey.trapAction",
  work: "journey.workAction",
  tanda: "journey.tanda",
  invest: "journey.invest",
  practice: "upgrade.practice",
  tandaLearn: "learn.tanda",
  college: "journey.collegeAction",
  coach: "journey.coach",
  history: "journey.history",
  reminders: "feedback.reminders",
} as const;
export const homeStages = [
  {
    title: "journey.grounded",
    body: "journey.groundedBody",
    icon: "wallet",
    tasks: ["cash", "income", "bills"],
    extras: ["benefits", "work", "trap"],
  },
  {
    title: "journey.stable",
    body: "journey.stableBody",
    icon: "jar",
    tasks: ["spending"],
    extras: ["cushion", "debt"],
  },
  {
    title: "journey.grow",
    body: "journey.growBody",
    icon: "sprout",
    tasks: ["goal"],
    extras: ["tanda", "tandaLearn"],
  },
  {
    title: "journey.wealth",
    body: "journey.wealthBody",
    icon: "sun",
    tasks: ["credit"],
    extras: ["invest", "practice", "college"],
  },
] as const;
export function taskStage(task?: HomeTaskId): number {
  return Math.max(
    0,
    homeStages.findIndex((stage) => [...stage.tasks, ...stage.extras].some((id) => id === task)),
  );
}
export function isFoundationTask(id: HomeTaskId): id is JourneyTaskId {
  return ["cash", "income", "bills", "spending", "goal", "credit"].includes(id);
}
