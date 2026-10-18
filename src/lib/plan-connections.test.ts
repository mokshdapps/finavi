import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { debtPayoff } from "./debt-payoff";
import { addCommitment, planCommitments, planFocus, validCalendarDay } from "./plan-connections";
import { emptyData } from "./store";

describe("connected money decisions", () => {
  it("prioritizes a cash gap over savings when a $300 bill exceeds $200 cash", () => {
    const plan = {
      ...emptyData().moneyPlan,
      cash: 200,
      events: [
        {
          id: "rent",
          label: "Rent",
          amount: 300,
          date: "2026-10-20",
          kind: "bill" as const,
          done: false,
        },
      ],
    };
    assert.equal(planFocus(plan, "2026-10-19").key, "gap");
    assert.equal(planFocus(plan, "2026-10-19").amount, 100);
  });
  it("adds a $75 commitment only once without moving cash", () => {
    const plan = { ...emptyData().moneyPlan, cash: 200 };
    const item = { id: "tanda:t:2", label: "Circle", amount: 75, date: "2026-10-20" };
    const next = addCommitment(plan, item);
    assert.equal(next.cash, 200);
    assert.equal(next.events[0]?.done, false);
    assert.equal(addCommitment(next, item).events.length, 1);
  });
  it("uses the next unpaid tanda round and leaves paid records unchanged", () => {
    const data = emptyData();
    data.tandas = [
      {
        id: "t",
        name: "Circle",
        people: 4,
        contribution: 75,
        frequency: "weekly",
        position: 3,
        startDate: "2026-10-19",
        paid: [1],
      },
    ];
    assert.equal(planCommitments(data, "2026-10-19")[0]?.date, "2026-10-26");
    assert.equal(planCommitments(data, "2026-10-19")[0]?.amount, 75);
    assert.deepEqual(data.tandas[0]?.paid, [1]);
  });
  it("rejects February 30 but accepts leap day", () => {
    assert.equal(validCalendarDay("2026-02-30"), false);
    assert.equal(validCalendarDay("2028-02-29"), true);
  });
});
describe("debt payoff comparison", () => {
  it("uses a partial last payment for a $100 balance at 12% APR", () => {
    const result = debtPayoff(100, 12, 200);
    assert.equal(result?.total, 101);
    assert.equal(result?.interest, 1);
    assert.equal(result?.rows[0]?.payment, 101);
    assert.equal(result?.rows[0]?.balance, 0);
  });
  it("clears $1,200 at zero APR in 12 payments of $100", () => {
    assert.equal(debtPayoff(1200, 0, 100)?.months, 12);
    assert.equal(debtPayoff(1200, 0, 100)?.interest, 0);
  });
  it("flags a $10 payment that only covers interest on $1,000 at 12%", () => {
    assert.equal(debtPayoff(1000, 12, 10)?.never, true);
  });
  it("reduces interest and payoff time with $50 extra", () => {
    const base = debtPayoff(1000, 24, 100);
    const extra = debtPayoff(1000, 24, 150);
    assert.ok(base && extra);
    assert.ok(extra.interest < base.interest);
    assert.ok(extra.months < base.months);
  });
  it("rejects non-finite input and negative rates", () => {
    assert.equal(debtPayoff(Infinity, 12, 100), null);
    assert.equal(debtPayoff(100, -12, 100), null);
  });
});
