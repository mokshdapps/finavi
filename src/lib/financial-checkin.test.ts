import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { emptyData, migrate } from "./store";
import { financialCheckIn, saveCheckIn, coachTopic } from "./financial-checkin";
import { allocateDebtPayments, spendingReview } from "./debt-priority";
import { normalizeLiveData } from "./live-data";
describe("live plan compatibility", () => {
  it("handles a mounted plan from before debt and check-in fields existed", () => {
    const data = emptyData();
    Reflect.deleteProperty(data, "debts");
    Reflect.deleteProperty(data, "checkIns");
    data.emergency.amount = 320;
    const normalized = normalizeLiveData(data);
    assert.deepEqual(normalized.debts, []);
    assert.deepEqual(normalized.checkIns, []);
    assert.equal(normalized.emergency.amount, 320);
    assert.equal(financialCheckIn(data, "2026-10-17").snapshot.debt, 0);
    assert.equal(Object.hasOwn(data, "debts"), false);
  });
  it("preserves existing debt and history without replacing complete state", () => {
    const data = emptyData();
    data.debts = [{ id: "card", label: "Card", balance: 1000, apr: 24, minimum: 50 }];
    assert.equal(normalizeLiveData(data), data);
    assert.equal(financialCheckIn(data, "2026-10-17").snapshot.debt, 1000);
  });
});
describe("private feedback tools", () => {
  it("does not credit an empty plan as ready", () =>
    assert.equal(financialCheckIn(emptyData(), "2026-10-17").ready, 0));
  it("prioritizes a real timing gap", () => {
    const d = emptyData();
    d.moneyPlan.cash = 200;
    d.moneyPlan.events = [
      { id: "rent", label: "Rent", kind: "bill", amount: 300, date: "2026-10-18", done: false },
    ];
    const c = financialCheckIn(d, "2026-10-17");
    assert.equal(c.forecast.lowest, -100);
    assert.equal(c.cashReady, false);
  });
  it("replaces same-day check-ins rather than tracking visits", () => {
    const first = financialCheckIn(emptyData(), "2026-10-17").snapshot;
    const history = saveCheckIn([first], { ...first, emergency: 100 });
    assert.equal(history.length, 1);
    assert.equal(history[0]?.emergency, 100);
  });
  it("orders debt by APR or smallest balance without changing stored debts", () => {
    const debts = [
      { id: "a", label: "A", balance: 1000, apr: 24, minimum: 100 },
      { id: "b", label: "B", balance: 200, apr: 10, minimum: 20 },
    ];
    assert.equal(allocateDebtPayments(debts, 50, "avalanche")[0]?.id, "a");
    assert.equal(allocateDebtPayments(debts, 50, "snowball")[0]?.id, "b");
    assert.equal(debts[0]?.balance, 1000);
  });
  it("caps extra to payoff and rolls remainder to next debt", () => {
    const rows = allocateDebtPayments(
      [
        { id: "a", label: "A", balance: 20, apr: 0, minimum: 10 },
        { id: "b", label: "B", balance: 100, apr: 0, minimum: 10 },
      ],
      50,
      "snowball",
    );
    assert.equal(rows[0]?.total, 20);
    assert.equal(rows[1]?.extra, 40);
  });
  it("calculates reductions only on user-classified wants", () =>
    assert.equal(
      spendingReview(
        [
          { amount: 100, category: "need" },
          { amount: 40, category: "want" },
        ],
        25,
      ),
      10,
    ));
  it("understands bilingual coaching topics", () => {
    assert.equal(coachTopic("¿Qué deuda pago primero?"), "debt");
    assert.equal(coachTopic("How do I plan for harvest?"), "season");
    assert.equal(coachTopic("something unrelated"), "unknown");
  });
  it("migrates older backups with empty history and debt lists", () => {
    const d = migrate({ emergency: { amount: 320 } });
    assert.equal(d.emergency.amount, 320);
    assert.deepEqual(d.debts, []);
    assert.deepEqual(d.checkIns, []);
  });
  it("rejects invalid saved APRs and history readiness", () => {
    assert.throws(() =>
      migrate({ debts: [{ id: "a", label: "A", balance: 20, apr: 1001, minimum: 10 }] }),
    );
    assert.throws(() =>
      migrate({
        checkIns: [
          { date: "2026-10-17", ready: 5, cashLowest: 0, emergency: 0, goalSaved: 0, debt: 0 },
        ],
      }),
    );
  });
});
import { validBenefitAnswers, foodIncomeIllustration } from "./benefit-guidance";
describe("benefit guidance boundaries", () => {
  const a = {
    household: 3,
    income: 2000,
    children: true,
    youngChildren: true,
    pregnant: false,
    seniorOrDisabled: false,
    paysRent: true,
    childrenCount: 1,
    under5Count: 1,
    under13Count: 1,
    earnedIncome: 2000,
    careAmount: 100,
  };
  it("uses 20 percent earned income deduction, not a fixed benefit award", () => {
    assert.equal(foodIncomeIllustration(a)?.earnedDeduction, 400);
    assert.equal(foodIncomeIllustration(a)?.afterKnownDeductions, 1500);
    assert.equal(foodIncomeIllustration(a, 2500)?.afterKnownDeductions, 1900);
  });
  it("does not treat non-work income as earned income", () =>
    assert.equal(foodIncomeIllustration({ ...a, earnedIncome: 0 })?.afterKnownDeductions, 1900));
  it("rejects impossible age counts and earned income exceeding gross", () => {
    assert.equal(validBenefitAnswers({ ...a, under5Count: 2 }), false);
    assert.equal(validBenefitAnswers({ ...a, earnedIncome: 2001 }), false);
    assert.equal(validBenefitAnswers(a), true);
  });
});
import { planReminders, reminderCalendar } from "./plan-reminders";
describe("local dated reminders", () => {
  it("includes overdue bills but excludes completed and distant ones", () => {
    const d = emptyData();
    d.moneyPlan.events = [
      { id: "due", label: "Rent, home", date: "2026-10-16", amount: 50, kind: "bill", done: false },
      { id: "done", label: "Done", date: "2026-10-17", amount: 10, kind: "bill", done: true },
      { id: "future", label: "Future", date: "2026-12-01", amount: 10, kind: "bill", done: false },
    ];
    const rows = planReminders(d, "2026-10-17");
    assert.deepEqual(
      rows.map((r) => r.id),
      ["due"],
    );
    assert.ok(reminderCalendar(rows).includes("SUMMARY:Rent\\, home"));
    assert.ok(reminderCalendar(rows).includes("TRIGGER:-PT12H"));
  });
});

describe("saved benefits validation", () => {
  it("rejects impossible imported household counts", () => {
    assert.throws(() =>
      migrate({
        benefits: {
          household: 1,
          income: 100,
          children: true,
          youngChildren: true,
          pregnant: false,
          seniorOrDisabled: false,
          paysRent: false,
          childrenCount: 2,
          under5Count: 2,
          under13Count: 2,
          completedAt: "2026-10-17T12:00:00Z",
        },
      }),
    );
  });
});
