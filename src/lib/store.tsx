import type { CheckIn } from "./financial-checkin";
import type { Debt } from "./debt-priority";
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { StoreContext } from "./store-context";
import { DATA_KEY, readSavedValue } from "./browser-storage";
import {
  emptyMoneyPlan,
  emptyWorkOffer,
  localDay,
  type MoneyPlan,
  type WorkOffer,
} from "./money-plan";
import { parseSavedData } from "./saved-data";
import { normalizeLiveData } from "./live-data";

export const STORE_KEY = DATA_KEY;

const useLoadEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type Frequency = "weekly" | "biweekly" | "monthly";
export type SpendCategory = "need" | "want" | "unsure";

export type Jar = {
  id: string;
  name: string;
  target: number | null;
  amount: number;
  archived: boolean;
  createdAt: string;
};

export type Tanda = {
  id: string;
  name: string;
  people: number;
  contribution: number;
  frequency: Frequency;
  position: number;
  startDate: string | null;
  paid: number[];
  members?: string[];
  missed?: number[];
  received?: boolean;
  organizer?: string;
};

export type SpendItem = {
  id: string;
  label: string;
  amount: number;
  category: SpendCategory;
};

export type BudgetBill = { id: string; label: string; amount: number; essential: boolean };

export type BudgetSettings = {
  bills: BudgetBill[];
  cashOnHand: number;
  taxEnabled: boolean;
  taxRatePct: number;
  milesPerWeek: number | null;
  startMonth: number;
  workKind: string | null;
};

export const defaultBudget = (): BudgetSettings => ({
  bills: [],
  cashOnHand: 0,
  taxEnabled: false,
  taxRatePct: 25,
  milesPerWeek: null,
  startMonth: new Date().getMonth(),
  workKind: null,
});

export type TrapMode = "flat" | "installment" | "revolving" | "rentown";

export type TrapCheck = {
  id: string;
  received: number;
  repay: number;
  period: number;
  unit: "days" | "weeks" | "months";
  apr: number;
  date: string;
  mode?: TrapMode;
};

export type BenefitAnswers = {
  household: number;
  income: number;
  children: boolean;
  youngChildren: boolean;
  pregnant: boolean;
  seniorOrDisabled: boolean;
  paysRent: boolean;
  annualIncome?: number | undefined;
  monthsWorked?: number | undefined;
  childrenCount?: number | undefined;
  under5Count?: number | undefined;
  under13Count?: number | undefined;
  seniorCount?: number | undefined;
  earnedIncome?: number | undefined;
  rentAmount?: number | undefined;
  careAmount?: number | undefined;
};

export type EmergencyEntry = { id: string; delta: number; date: string };

export type AppData = {
  checkIns: CheckIn[];
  debts: Debt[];
  moneyPlan: MoneyPlan;
  workOffers: [WorkOffer, WorkOffer];
  practiceCorrect: string[];
  onboarded: boolean;
  demo: boolean;
  income: (number | null)[];
  budget: BudgetSettings;
  emergency: { amount: number; target: number; history: EmergencyEntry[] };
  jars: Jar[];
  tandas: Tanda[];
  spending: SpendItem[];
  benefits: (BenefitAnswers & { completedAt: string }) | null;
  trapChecks: TrapCheck[];
  learnRead: string[];
  invest: { cash: number; holdings: Record<string, number>; step: number };
};

export const INITIAL_CASH = 1000;

export const emptyData = (): AppData => ({
  checkIns: [],
  debts: [],
  moneyPlan: emptyMoneyPlan(),
  workOffers: [emptyWorkOffer(), emptyWorkOffer()],
  practiceCorrect: [],
  onboarded: false,
  demo: false,
  income: Array(12).fill(null),
  budget: defaultBudget(),
  emergency: { amount: 0, target: 500, history: [] },
  jars: [],
  tandas: [],
  spending: [],
  benefits: null,
  trapChecks: [],
  learnRead: [],
  invest: { cash: INITIAL_CASH, holdings: {}, step: 0 },
});

export const uid = () => Math.random().toString(36).slice(2, 10);

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export function demoData(onboarded = true): AppData {
  const start = new Date();
  start.setDate(start.getDate() - 40);
  const futureDay = (days: number) => {
    const day = new Date();
    day.setDate(day.getDate() + days);
    return localDay(day);
  };
  return {
    checkIns: [],
    debts: [],
    moneyPlan: {
      cash: 350,
      protected: 100,
      days: 14,
      events: [
        {
          id: "demo-rent",
          label: "Rent",
          amount: 500,
          date: futureDay(2),
          kind: "bill",
          done: false,
        },
        {
          id: "demo-pay",
          label: "Harvest paycheck",
          amount: 1200,
          date: futureDay(5),
          kind: "income",
          done: false,
        },
        {
          id: "demo-phone",
          label: "Phone",
          amount: 65,
          date: futureDay(7),
          kind: "bill",
          done: false,
        },
      ],
    },
    workOffers: [
      { gross: 120, hours: 4, unpaid: 1, costs: 20, taxPct: 25 },
      { gross: 100, hours: 5, unpaid: 0, costs: 0, taxPct: 25 },
    ],
    practiceCorrect: [],
    onboarded,
    demo: true,
    income: [1400, 1300, 1800, 2600, 3800, 4200, 4400, 4100, 3600, 2400, 1500, 1100],
    budget: {
      ...defaultBudget(),
      workKind: "tree-fruit",
      cashOnHand: 850,
      taxEnabled: true,
      taxRatePct: 22,
      milesPerWeek: 120,
      startMonth: 0,
      bills: [
        { id: uid(), label: "Rent", amount: 950, essential: true },
        { id: uid(), label: "Groceries", amount: 520, essential: true },
        { id: uid(), label: "Utilities", amount: 145, essential: true },
        { id: uid(), label: "Gas & truck", amount: 240, essential: true },
        { id: uid(), label: "Phone", amount: 65, essential: true },
        { id: uid(), label: "Money sent home", amount: 200, essential: false },
      ],
    },
    emergency: {
      amount: 320,
      target: 500,
      history: [
        { id: uid(), delta: 100, date: daysAgo(46) },
        { id: uid(), delta: 50, date: daysAgo(30) },
        { id: uid(), delta: 120, date: daysAgo(17) },
        { id: uid(), delta: -50, date: daysAgo(9) },
        { id: uid(), delta: 100, date: daysAgo(3) },
      ],
    },
    jars: [
      {
        id: "jar-car",
        name: "Used car",
        target: 4500,
        amount: 1150,
        archived: false,
        createdAt: daysAgo(120),
      },
      {
        id: "jar-quince",
        name: "Quinceañera",
        target: 3000,
        amount: 640,
        archived: false,
        createdAt: daysAgo(80),
      },
      {
        id: "jar-tools",
        name: "Work tools",
        target: 400,
        amount: 400,
        archived: false,
        createdAt: daysAgo(60),
      },
    ],
    tandas: [
      {
        id: "tanda-family",
        name: "Family tanda",
        people: 10,
        contribution: 100,
        frequency: "biweekly",
        position: 4,
        startDate: start.toISOString().slice(0, 10),
        paid: [1, 2],
      },
    ],
    spending: [
      { id: uid(), label: "Groceries", amount: 148, category: "need" },
      { id: uid(), label: "Gas for the truck", amount: 62, category: "need" },
      { id: uid(), label: "Phone bill", amount: 45, category: "need" },
      { id: uid(), label: "Takeout, Friday", amount: 34, category: "want" },
      { id: uid(), label: "Kids' shoes", amount: 55, category: "need" },
      { id: uid(), label: "Streaming subscriptions", amount: 22, category: "want" },
      { id: uid(), label: "Birthday gift", amount: 40, category: "unsure" },
      { id: uid(), label: "Laundromat", amount: 18, category: "need" },
      { id: uid(), label: "Energy drinks & snacks", amount: 27, category: "want" },
    ],
    benefits: {
      household: 5,
      income: 2600,
      children: true,
      youngChildren: true,
      pregnant: false,
      seniorOrDisabled: false,
      paysRent: true,
      completedAt: daysAgo(12),
    },
    trapChecks: [
      {
        id: uid(),
        received: 500,
        repay: 575,
        period: 14,
        unit: "days",
        apr: 391,
        date: daysAgo(21),
      },
    ],
    learnRead: ["credit-1", "credit-2"],
    invest: { cash: 380, holdings: { VTI: 2, VXUS: 3, BND: 2 }, step: 2 },
  };
}

export function migrate(raw: unknown): AppData {
  return parseSavedData(raw, emptyData());
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState<"read" | "write" | null>(null);
  const [recoveryData, setRecoveryData] = useState<string | null>(null);

  useLoadEffect(() => {
    let raw: string | null = null;
    try {
      raw = readSavedValue(localStorage, STORE_KEY);
      if (raw) setData(migrate(JSON.parse(raw)));
    } catch {
      setStorageError("read");
      setRecoveryData(raw);
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: AppData) => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
      setStorageError(null);
    } catch {
      setStorageError("write");
    }
  }, []);

  const update = useCallback(
    (fn: (draft: AppData) => AppData) => {
      setData((prev) => {
        const next = normalizeLiveData(fn(normalizeLiveData(prev)));
        if (storageError !== "read") persist(next);
        return next;
      });
    },
    [persist, storageError],
  );

  const replace = useCallback(
    (next: AppData) => {
      setData(next);
      persist(next);
    },
    [persist],
  );

  const reset = useCallback(() => {
    const next = emptyData();
    next.onboarded = true;
    setData(next);
    persist(next);
  }, [persist]);

  const loadDemo = useCallback(() => {
    const next = demoData(true);
    setData(next);
    persist(next);
  }, [persist]);

  const value = useMemo(
    () => ({
      data: normalizeLiveData(data),
      ready,
      update,
      replace,
      reset,
      loadDemo,
      storageError,
      recoveryData,
    }),
    [data, ready, update, replace, reset, loadDemo, storageError, recoveryData],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
