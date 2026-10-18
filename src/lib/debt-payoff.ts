export type DebtMonth = {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
};

export function debtPayoff(balance: number, apr: number, payment: number) {
  if (
    ![balance, apr, payment].every(Number.isFinite) ||
    balance < 0 ||
    apr < 0 ||
    apr > 1000 ||
    payment <= 0
  )
    return null;
  const rows: DebtMonth[] = [];
  let remaining = balance;
  let interest = 0;
  let total = 0;
  const firstInterest = (balance * apr) / 1200;
  if (balance > 0 && payment <= firstInterest)
    return { rows, interest, total, months: 0, never: true, firstInterest };
  while (remaining > 0.0000001 && rows.length < 1200) {
    const charge = (remaining * apr) / 1200;
    const paid = Math.min(payment, remaining + charge);
    const principal = paid - charge;
    remaining = Math.max(0, remaining - principal);
    interest += charge;
    total += paid;
    rows.push({
      month: rows.length + 1,
      payment: paid,
      interest: charge,
      principal,
      balance: remaining,
    });
  }
  return {
    rows,
    interest,
    total,
    months: rows.length,
    never: remaining > 0.0000001,
    firstInterest,
  };
}
