import { createContext, type Context } from "react";
import type { Lang, TKey } from "./i18n";

export type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
  money: (n: number, cents?: boolean) => string;
  monthName: (i: number, short?: boolean) => string;
  formatDate: (d: Date | string) => string;
};

export const I18nContext: Context<LanguageContextValue | null> =
  import.meta.hot?.data.context ?? createContext<LanguageContextValue | null>(null);

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    data.context = I18nContext;
  });
}
