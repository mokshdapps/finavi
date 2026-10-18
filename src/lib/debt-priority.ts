export type Debt = { id: string; label: string; balance: number; apr: number; minimum: number };
export function validDebt(debt: Debt) {
  return (
    debt.label.trim().length > 0 &&
    [debt.balance, debt.apr, debt.minimum].every(Number.isFinite) &&
    debt.balance > 0 &&
    debt.minimum > 0 &&
    debt.apr >= 0 &&
    debt.apr <= 1000
  );
}
export function allocateDebtPayments(
  debts: Debt[],
  extra: number,
  method: "avalanche" | "snowball",
) {
  if (!Number.isFinite(extra) || extra < 0 || debts.some((d) => !validDebt(d))) return [];
  const ordered = [...debts].sort((a, b) =>
    method === "avalanche"
      ? b.apr - a.apr || a.balance - b.balance || a.id.localeCompare(b.id)
      : a.balance - b.balance || b.apr - a.apr || a.id.localeCompare(b.id),
  );
  let available = extra;
  return ordered.map((debt) => {
    const interest = (debt.balance * debt.apr) / 1200;
    const owed = Math.round((debt.balance + interest) * 100) / 100;
    const minimum = Math.min(debt.minimum, owed);
    const allocated = Math.min(available, Math.max(0, owed - minimum));
    available = Math.round((available - allocated) * 100) / 100;
    return {
      ...debt,
      minimum,
      extra: Math.round(allocated * 100) / 100,
      total: Math.round((minimum + allocated) * 100) / 100,
    };
  });
}
export function spendingReview(items: { amount: number; category: string }[], reduction: number) {
  const wants = items.filter((i) => i.category === "want").reduce((s, i) => s + i.amount, 0);
  return Math.round(wants * Math.min(100, Math.max(0, reduction))) / 100;
}
