import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { cashForecast, completeCashEvent, offerTakeHome, emptyMoneyPlan } from "./money-plan";
import { computeApr, payoffSchedule, tandaMath } from "./finance";
import { migrate, emptyData, demoData } from "./store";
import { tandaInsights } from "./tanda";
import { MILEAGE_RATE, buildHarvestPlan, runScenario } from "./harvest";

describe("cash-flow planning", () => {
  it("detects a shortfall before a later paycheck even when the ending cash is positive", () => {
    const forecast = cashForecast(
      {
        cash: 200,
        protected: 0,
        days: 7,
        events: [
          { id: "rent", label: "Rent", amount: 300, date: "2026-10-20", kind: "bill", done: false },
          { id: "pay", label: "Pay", amount: 500, date: "2026-10-23", kind: "income", done: false },
        ],
      },
      "2026-10-19",
    );
    assert.equal(forecast.lowest, -100);
    assert.equal(forecast.end, 400);
    assert.equal(forecast.safe, 0);
    assert.equal(forecast.gapDate, "2026-10-20");
  });
  it("does not count protected cash as spending room", () => {
    assert.equal(
      cashForecast({ ...emptyMoneyPlan(), cash: 400, protected: 150 }, "2026-10-19").safe,
      250,
    );
  });
  it("includes overdue unpaid bills but excludes completed or out-of-window items", () => {
    const plan = {
      ...emptyMoneyPlan(),
      cash: 500,
      events: [
        {
          id: "a",
          label: "Overdue",
          amount: 100,
          date: "2026-10-01",
          kind: "bill" as const,
          done: false,
        },
        {
          id: "b",
          label: "Paid",
          amount: 150,
          date: "2026-10-19",
          kind: "bill" as const,
          done: true,
        },
        {
          id: "c",
          label: "Future",
          amount: 200,
          date: "2026-12-01",
          kind: "bill" as const,
          done: false,
        },
      ],
    };
    assert.equal(cashForecast(plan, "2026-10-19").end, 400);
  });
  it("moves cash once when completed and reverses it when reopened", () => {
    const plan = {
      ...emptyMoneyPlan(),
      cash: 500,
      events: [
        {
          id: "a",
          label: "Rent",
          amount: 100,
          date: "2026-10-19",
          kind: "bill" as const,
          done: false,
        },
      ],
    };
    const paid = completeCashEvent(plan, "a");
    assert.equal(paid.cash, 400);
    assert.equal(cashForecast(paid, "2026-10-19").end, 400);
    assert.equal(completeCashEvent(paid, "a").cash, 500);
  });
  it("treats same-day bills conservatively before uncertain pay", () => {
    const forecast = cashForecast(
      {
        ...emptyMoneyPlan(),
        cash: 0,
        events: [
          { id: "i", label: "Pay", amount: 500, date: "2026-10-19", kind: "income", done: false },
          { id: "b", label: "Rent", amount: 300, date: "2026-10-19", kind: "bill", done: false },
        ],
      },
      "2026-10-19",
    );
    assert.equal(forecast.lowest, -300);
  });
});
describe("work offer comparison", () => {
  it("includes unpaid time and work expenses", () => {
    assert.equal(
      offerTakeHome({ gross: 120, hours: 4, unpaid: 1, costs: 20, taxPct: 0 }).hourly,
      20,
    );
  });
  it("reserves the chosen tax percentage on positive profit only", () => {
    const result = offerTakeHome({ gross: 120, hours: 4, unpaid: 1, costs: 20, taxPct: 25 });
    assert.equal(result.reserve, 25);
    assert.equal(result.net, 75);
    assert.equal(result.hourly, 15);
  });
  it("reports out-of-pocket losses without negative tax", () => {
    const result = offerTakeHome({ gross: 20, hours: 1, unpaid: 0, costs: 30, taxPct: 25 });
    assert.equal(result.reserve, 0);
    assert.equal(result.net, -10);
  });
});
describe("saved financial data", () => {
  it("restores missing nested defaults in older backups", () => {
    const data = migrate({ emergency: { amount: 320 }, budget: { cashOnHand: 850 } });
    assert.equal(data.emergency.target, 500);
    assert.deepEqual(data.budget.bills, []);
    assert.equal(data.moneyPlan.cash, 0);
  });
  it("rejects malformed backups instead of importing unusable financial values", () => {
    assert.throws(() => migrate({ emergency: { amount: "lots" } }));
    assert.throws(() => migrate({ income: [10] }));
    assert.throws(() => migrate({ budget: { startMonth: 99 } }));
  });
  it("round-trips complete current data and examples", () => {
    assert.deepEqual(migrate(JSON.parse(JSON.stringify(emptyData()))), emptyData());
    const demo = demoData();
    assert.deepEqual(migrate(JSON.parse(JSON.stringify(demo))), demo);
  });
});
describe("borrowing and savings-circle regressions", () => {
  it("keeps the $300 / $45 / 14-day example at about 391% APR", () => {
    assert.ok(Math.abs(computeApr(300, 345, 14) - 391.07142857) < 0.001);
  });
  it("does not subtract a final partial payment from actual interest", () => {
    const result = payoffSchedule(100, 12, 200);
    assert.equal(result.interest, 1);
    assert.equal(result.total, 101);
    assert.equal(result.months, 1);
  });
  it("does not invent negative interest for a zero-rate loan", () => {
    assert.equal(payoffSchedule(100, 0, 60).interest, 0);
  });
  it("does not declare payoff when the simulation limit leaves debt", () => {
    assert.equal(payoffSchedule(1000, 12, 10.000001).never, true);
  });
  it("does not infer receiving the pot from contribution counts", () => {
    const tanda = {
      id: "t",
      name: "Circle",
      people: 10,
      contribution: 100,
      frequency: "weekly" as const,
      position: 2,
      startDate: null,
      paid: [5, 6],
    };
    assert.equal(tandaMath(tanda).roundsUntilPayout, 2);
    assert.equal(tandaInsights(tanda).received, false);
  });
});

describe("seasonal planning", () => {
  it("uses the IRS 2026 business mileage rate of 72.5 cents", () => {
    assert.equal(MILEAGE_RATE, 0.725);
  });
  it("stress-tests the existing paycheck rather than quietly reducing spending", () => {
    const settings = {
      ...emptyData().budget,
      cashOnHand: 0,
      bills: [{ id: "rent", label: "Rent", amount: 1000, essential: true }],
    };
    const income = Array(12).fill(1200);
    const result = runScenario(income, settings, "prices");
    assert.equal(buildHarvestPlan(income, settings)?.safePaycheck, 1200);
    assert.equal(result?.safePaycheck, 1020);
    assert.equal(result?.minBalance, -2160);
  });
});
