import { validBenefitAnswers } from "./benefit-guidance";
import { z } from "zod";
import type { AppData } from "./store";

const number = z.number().finite().min(0).max(1_000_000_000);
const text = z.string().max(300);
const id = z.string().min(1).max(100);
const date = z.string().refine((value) => Number.isFinite(Date.parse(value)), "Invalid date");
const day = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((v) => Number.isFinite(Date.parse(v)));
const frequency = z.enum(["weekly", "biweekly", "monthly"]);
const round = z.number().int().min(1).max(99);
const offer = z.object({
  gross: number,
  hours: number,
  unpaid: number,
  costs: number,
  taxPct: z.number().min(0).max(100),
});
const schema = z.object({
  checkIns: z
    .array(
      z.object({
        date: day,
        ready: z.number().int().min(0).max(4),
        cashLowest: z.number().finite(),
        emergency: number,
        goalSaved: number,
        debt: number,
      }),
    )
    .max(366)
    .optional(),
  debts: z
    .array(
      z.object({
        id,
        label: text.min(1),
        balance: number.positive(),
        apr: z.number().finite().min(0).max(1000),
        minimum: number.positive(),
      }),
    )
    .max(1000)
    .optional(),
  onboarded: z.boolean().optional(),
  demo: z.boolean().optional(),
  income: z.array(number.nullable()).length(12).optional(),
  budget: z
    .object({
      bills: z
        .array(z.object({ id, label: text, amount: number, essential: z.boolean() }))
        .max(1000)
        .optional(),
      cashOnHand: number.optional(),
      taxEnabled: z.boolean().optional(),
      taxRatePct: z.number().min(0).max(100).optional(),
      milesPerWeek: number.nullable().optional(),
      startMonth: z.number().int().min(0).max(11).optional(),
      workKind: text.nullable().optional(),
    })
    .optional(),
  emergency: z
    .object({
      amount: number.optional(),
      target: number.positive().optional(),
      history: z
        .array(z.object({ id, delta: z.number().finite(), date }))
        .max(10000)
        .optional(),
    })
    .optional(),
  jars: z
    .array(
      z.object({
        id,
        name: text,
        target: number.positive().nullable(),
        amount: number,
        archived: z.boolean(),
        createdAt: date,
      }),
    )
    .max(1000)
    .optional(),
  tandas: z
    .array(
      z
        .object({
          id,
          name: text,
          people: z.number().int().min(2).max(99),
          contribution: number.positive(),
          frequency,
          position: round,
          startDate: day.nullable(),
          paid: z.array(round),
          members: z.array(text).optional(),
          missed: z.array(round).optional(),
          received: z.boolean().optional(),
          organizer: text.optional(),
        })
        .refine(
          (t) =>
            t.position <= t.people &&
            [...t.paid, ...(t.missed ?? [])].every((r) => r <= t.people) &&
            new Set(t.paid).size === t.paid.length,
        ),
    )
    .max(1000)
    .optional(),
  spending: z
    .array(
      z.object({ id, label: text, amount: number, category: z.enum(["need", "want", "unsure"]) }),
    )
    .max(10000)
    .optional(),
  benefits: z
    .object({
      household: z.number().int().min(1).max(99),
      income: number,
      children: z.boolean(),
      youngChildren: z.boolean(),
      pregnant: z.boolean(),
      seniorOrDisabled: z.boolean(),
      paysRent: z.boolean(),
      annualIncome: number.optional(),
      monthsWorked: z.number().int().min(0).max(12).optional(),
      childrenCount: z.number().int().min(0).max(99).optional(),
      under5Count: z.number().int().min(0).max(99).optional(),
      under13Count: z.number().int().min(0).max(99).optional(),
      seniorCount: z.number().int().min(0).max(99).optional(),
      earnedIncome: number.optional(),
      rentAmount: number.optional(),
      careAmount: number.optional(),
      completedAt: date,
    })
    .refine(validBenefitAnswers, "Invalid household counts or income")
    .nullable()
    .optional(),
  trapChecks: z
    .array(
      z.object({
        id,
        received: number,
        repay: number,
        period: number,
        unit: z.enum(["days", "weeks", "months"]),
        apr: number,
        date,
        mode: z.enum(["flat", "installment", "revolving", "rentown"]).optional(),
      }),
    )
    .max(10000)
    .optional(),
  learnRead: z.array(text).max(1000).optional(),
  invest: z
    .object({
      cash: number.optional(),
      holdings: z.record(number).optional(),
      step: z.number().int().min(0).optional(),
    })
    .optional(),
  moneyPlan: z
    .object({
      cash: z.number().finite(),
      protected: number,
      days: z.number().int().min(1).max(90),
      events: z
        .array(
          z.object({
            id,
            label: text,
            amount: number.positive(),
            date: day,
            kind: z.enum(["income", "bill"]),
            done: z.boolean(),
          }),
        )
        .max(10000),
    })
    .optional(),
  workOffers: z.tuple([offer, offer]).optional(),
  practiceCorrect: z.array(text).max(1000).optional(),
});
export function parseSavedData(raw: unknown, base: AppData): AppData {
  const d = schema.parse(raw);
  return {
    checkIns: d.checkIns ?? base.checkIns,
    debts: d.debts ?? base.debts,
    onboarded: d.onboarded ?? base.onboarded,
    demo: d.demo ?? base.demo,
    income: d.income ?? base.income,
    budget: {
      bills: d.budget?.bills ?? base.budget.bills,
      cashOnHand: d.budget?.cashOnHand ?? base.budget.cashOnHand,
      taxEnabled: d.budget?.taxEnabled ?? base.budget.taxEnabled,
      taxRatePct: d.budget?.taxRatePct ?? base.budget.taxRatePct,
      milesPerWeek: d.budget?.milesPerWeek ?? base.budget.milesPerWeek,
      startMonth: d.budget?.startMonth ?? base.budget.startMonth,
      workKind: d.budget?.workKind ?? base.budget.workKind,
    },
    emergency: {
      amount: d.emergency?.amount ?? base.emergency.amount,
      target: d.emergency?.target ?? base.emergency.target,
      history: d.emergency?.history ?? base.emergency.history,
    },
    jars: d.jars ?? base.jars,
    tandas:
      d.tandas?.map((t) => ({
        id: t.id,
        name: t.name,
        people: t.people,
        contribution: t.contribution,
        frequency: t.frequency,
        position: t.position,
        startDate: t.startDate,
        paid: t.paid,
        ...(t.members !== undefined ? { members: t.members } : {}),
        ...(t.missed !== undefined ? { missed: t.missed } : {}),
        ...(t.received !== undefined ? { received: t.received } : {}),
        ...(t.organizer !== undefined ? { organizer: t.organizer } : {}),
      })) ?? base.tandas,
    spending: d.spending ?? base.spending,
    benefits: d.benefits ?? base.benefits,
    trapChecks:
      d.trapChecks?.map((t) => ({
        id: t.id,
        received: t.received,
        repay: t.repay,
        period: t.period,
        unit: t.unit,
        apr: t.apr,
        date: t.date,
        ...(t.mode !== undefined ? { mode: t.mode } : {}),
      })) ?? base.trapChecks,
    learnRead: d.learnRead ?? base.learnRead,
    invest: {
      cash: d.invest?.cash ?? base.invest.cash,
      holdings: d.invest?.holdings ?? base.invest.holdings,
      step: d.invest?.step ?? base.invest.step,
    },
    moneyPlan: d.moneyPlan ?? base.moneyPlan,
    workOffers: d.workOffers ?? base.workOffers,
    practiceCorrect: d.practiceCorrect ?? base.practiceCorrect,
  };
}
