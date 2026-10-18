import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { emptyData } from "./store";
import { moneyJourney, monthlyCashflow } from "./money-journey";

describe("100-point planning progress", () => {
  it("starts at zero and does not reward wealth or punish a cash gap", () => {
    const data = emptyData();
    assert.equal(moneyJourney(data).score, 0);
    data.moneyPlan.cash = -500;
    data.emergency.amount = 10000;
    data.debts = [{ id: "debt", label: "Debt", balance: 2000, apr: 24, minimum: 100 }];
    assert.equal(moneyJourney(data).score, 0);
  });
  it("awards 20 points for a dated cash plan", () => {
    const data = emptyData();
    data.moneyPlan.events = [
      { id: "bill", label: "Bill", amount: 50, kind: "bill", date: "2026-10-18", done: false },
    ];
    assert.equal(moneyJourney(data, "2026-10-17").score, 20);
    assert.equal(moneyJourney(data, "2026-10-17").focus, "cash");
  });
  it("awards 20 for all twelve income estimates including explicit zero months", () => {
    const data = emptyData();
    data.income = Array(12).fill(0);
    assert.equal(moneyJourney(data).score, 20);
    data.income[0] = null;
    assert.equal(moneyJourney(data).score, 18);
  });
  it("awards 15 for a monthly bill plan", () => {
    const data = emptyData();
    data.budget.bills = [{ id: "bill", label: "Rent", amount: 200, essential: true }];
    assert.equal(moneyJourney(data).score, 15);
  });
  it("awards spending points only for the share actually sorted, up to 15", () => {
    const data = emptyData();
    data.spending = [
      { id: "a", label: "A", amount: 10, category: "need" },
      { id: "b", label: "B", amount: 30, category: "unsure" },
    ];
    assert.equal(moneyJourney(data).points.spending, 7.5);
    data.spending[1] = { id: "b", label: "B", amount: 30, category: "want" };
    assert.equal(moneyJourney(data).score, 15);
  });
  it("awards 20 for an active goal target, not the saved amount", () => {
    const data = emptyData();
    data.jars = [
      {
        id: "goal",
        name: "Goal",
        target: 500,
        amount: 0,
        archived: false,
        createdAt: "2026-10-17",
      },
    ];
    assert.equal(moneyJourney(data).score, 20);
    data.jars[0] = {
      ...data.jars[0],
      id: "goal",
      name: "Goal",
      target: 500,
      amount: 100,
      archived: true,
      createdAt: "2026-10-17",
    };
    assert.equal(moneyJourney(data).score, 0);
  });
  it("awards 10 for a recorded credit lesson and caps the complete plan at 100", () => {
    const data = emptyData();
    data.learnRead = ["credit-1"];
    assert.equal(moneyJourney(data).score, 10);
    data.income = Array(12).fill(1000);
    data.budget.bills = [{ id: "bill", label: "Rent", amount: 200, essential: true }];
    data.moneyPlan.events = [
      { id: "pay", label: "Pay", amount: 1000, kind: "income", date: "2026-10-18", done: false },
    ];
    data.spending = [{ id: "buy", label: "Food", amount: 50, category: "need" }];
    data.jars = [
      {
        id: "goal",
        name: "Goal",
        target: 500,
        amount: 0,
        archived: false,
        createdAt: "2026-10-17",
      },
    ];
    assert.equal(moneyJourney(data).score, 100);
    assert.equal(moneyJourney(data).milestone, 100);
    data.spending = Array.from({ length: 100 }, (_, i) => ({
      id: String(i),
      label: "Purchase",
      amount: 1,
      category: i === 0 ? ("unsure" as const) : ("need" as const),
    }));
    assert.equal(moneyJourney(data).score, 99);
    assert.equal(moneyJourney(data).milestone, 75);
  });
  it("keeps a cash gap first even when all planning foundations are recorded", () => {
    const data = emptyData();
    data.moneyPlan.cash = 100;
    data.moneyPlan.events = [
      { id: "bill", label: "Bill", amount: 300, date: "2026-10-17", kind: "bill", done: false },
    ];
    data.income = Array(12).fill(1000);
    assert.equal(moneyJourney(data, "2026-10-17").focus, "cash");
    assert.equal(moneyJourney(data, "2026-10-17").forecast.lowest, -200);
  });
});
describe("long-term estimated breathing room", () => {
  it("subtracts all monthly expenses and accumulates surplus from the entered reserve", () => {
    const data = emptyData();
    data.income = Array(12).fill(1000);
    data.budget.startMonth = 3;
    data.budget.cashOnHand = 200;
    data.budget.bills = [
      { id: "need", label: "Rent", amount: 500, essential: true },
      { id: "want", label: "Extra", amount: 100, essential: false },
    ];
    const result = monthlyCashflow(data);
    assert.equal(result.rows[0]?.month, 3);
    assert.equal(result.rows[0]?.delta, 400);
    assert.equal(result.rows[0]?.reserve, 600);
    assert.equal(result.endReserve, 5000);
    assert.equal(data.moneyPlan.cash, 0);
  });
  it("does not portray missing months or missing bills as zero expenses", () => {
    const data = emptyData();
    data.budget.startMonth = 0;
    assert.equal(monthlyCashflow(data).endReserve, null);
    data.income = Array(12).fill(1000);
    assert.equal(monthlyCashflow(data).complete, false);
    data.budget.bills = [{ id: "bill", label: "Bill", amount: 500, essential: true }];
    data.income[1] = null;
    assert.equal(monthlyCashflow(data).rows[1]?.income, null);
    assert.equal(monthlyCashflow(data).rows[2]?.reserve, null);
  });
  it("uses the existing tax set-aside without double counting the emergency fund", () => {
    const data = emptyData();
    data.income = Array(12).fill(1000);
    data.budget.taxEnabled = true;
    data.budget.taxRatePct = 20;
    data.budget.startMonth = 0;
    data.budget.bills = [{ id: "bill", label: "Bill", amount: 500, essential: true }];
    data.emergency.amount = 500;
    assert.equal(monthlyCashflow(data).rows[0]?.income, 800);
    assert.equal(monthlyCashflow(data).endReserve, 3600);
  });
});
