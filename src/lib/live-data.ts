import type { AppData } from "./store";

export function normalizeLiveData(data: AppData): AppData {
  if (Array.isArray(data.debts) && Array.isArray(data.checkIns)) return data;
  return {
    ...data,
    debts: Array.isArray(data.debts) ? data.debts : [],
    checkIns: Array.isArray(data.checkIns) ? data.checkIns : [],
  };
}
