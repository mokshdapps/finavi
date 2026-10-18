import type { BenefitAnswers } from "./store";
export function validBenefitAnswers(a: BenefitAnswers) {
  const child = a.childrenCount ?? (a.children ? 1 : 0),
    young = a.under5Count ?? (a.youngChildren ? 1 : 0),
    under13 = a.under13Count ?? young,
    senior = a.seniorCount ?? (a.seniorOrDisabled ? 1 : 0);
  return (
    [
      a.income,
      a.annualIncome ?? 0,
      a.earnedIncome ?? 0,
      a.rentAmount ?? 0,
      a.careAmount ?? 0,
    ].every((v) => Number.isFinite(v) && v >= 0) &&
    [a.household, child, young, under13, senior, a.monthsWorked ?? 0].every(Number.isInteger) &&
    a.household >= 1 &&
    child >= 0 &&
    young >= 0 &&
    under13 >= young &&
    child >= under13 &&
    senior >= 0 &&
    child <= a.household &&
    senior <= a.household &&
    (a.earnedIncome ?? 0) <= a.income &&
    (a.monthsWorked ?? 0) >= 0 &&
    (a.monthsWorked ?? 0) <= 12
  );
}
export function foodIncomeIllustration(a: BenefitAnswers, income = a.income) {
  if (!Number.isFinite(income) || income < 0) return null;
  const earnedShare = a.income > 0 ? Math.min(1, (a.earnedIncome ?? 0) / a.income) : 0;
  const earned = income * earnedShare;
  const earnedDeduction = earned * 0.2;
  const careDeduction = a.careAmount ?? 0;
  const afterKnownDeductions = Math.max(0, income - earnedDeduction - careDeduction);
  return {
    income,
    earnedDeduction: Math.round(earnedDeduction),
    careDeduction,
    afterKnownDeductions: Math.round(afterKnownDeductions),
  };
}
