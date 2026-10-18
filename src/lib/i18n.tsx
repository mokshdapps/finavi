import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { I18nContext, type LanguageContextValue } from "./language-context";
import { en } from "@/data/translations/en";
import { es } from "@/data/translations/es";
import { LANGUAGE_KEY, readSavedValue } from "./browser-storage";

export type Lang = "en" | "es";

const LANG_KEY = LANGUAGE_KEY;

export type TKey = keyof typeof en;
const dicts: Record<Lang, Record<string, string>> = { en, es };

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = readSavedValue(localStorage, LANG_KEY);
      if (stored === "en" || stored === "es") setLangState(stored);
    } catch {
      setLangState("en");
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      document.documentElement.lang = l;
    }
    document.documentElement.lang = l;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(() => {
    const locale = lang === "es" ? "es-US" : "en-US";
    return {
      lang,
      setLang,
      t: (key, vars) => {
        let s = dicts[lang][key] ?? dicts.en[key] ?? String(key);
        if (vars) {
          for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
        }
        return s;
      },
      money: (n, cents = false) =>
        new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: cents ? 2 : 0,
          maximumFractionDigits: cents ? 2 : 0,
        }).format(Number.isFinite(n) ? n : 0),
      monthName: (i, short = true) =>
        new Intl.DateTimeFormat(locale, { month: short ? "short" : "long" }).format(
          new Date(2024, i, 1),
        ),
      formatDate: (d) =>
        new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(
          typeof d === "string" ? new Date(d) : d,
        ),
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
