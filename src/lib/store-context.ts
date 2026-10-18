import { createContext, type Context } from "react";
import type { AppData } from "./store";

export type StoreContextValue = {
  data: AppData;
  ready: boolean;
  update: (fn: (draft: AppData) => AppData) => void;
  replace: (next: AppData) => void;
  reset: () => void;
  loadDemo: () => void;
  storageError: "read" | "write" | null;
  recoveryData: string | null;
};

export const StoreContext: Context<StoreContextValue | null> =
  import.meta.hot?.data.context ?? createContext<StoreContextValue | null>(null);

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    data.context = StoreContext;
  });
}
