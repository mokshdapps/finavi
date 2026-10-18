import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { TKey } from "@/lib/i18n";
import { STAGES } from "@/lib/finance";
import type { Stage, StageState } from "@/lib/finance";
import { cn } from "@/lib/utils";
import { BrandIcon, type BrandIconName } from "./BrandIcon";

const stageIcons: Record<Stage, BrandIconName> = {
  survive: "wallet",
  stabilize: "jar",
  grow: "sprout",
  wealth: "sun",
};

const labelKey: Record<Stage, TKey> = {
  survive: "ladder.survive",
  stabilize: "ladder.stabilize",
  grow: "ladder.grow",
  wealth: "ladder.wealth",
};
const descKey: Record<Stage, TKey> = {
  survive: "ladder.survive.desc",
  stabilize: "ladder.stabilize.desc",
  grow: "ladder.grow.desc",
  wealth: "ladder.wealth.desc",
};

export function LadderPath({ state }: { state: StageState }) {
  const { t } = useI18n();
  const currentIndex = STAGES.indexOf(state.stage);

  return (
    <ol className="relative">
      {STAGES.map((stage, i) => {
        const done = state.completed[stage];
        const current = stage === state.stage;
        const reached = i <= currentIndex;
        return (
          <li key={stage} className="relative flex gap-4 pb-7 last:pb-0">
            {i < STAGES.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-10 bottom-0 left-[19px] w-0.5",
                  reached ? "bg-primary/35" : "bg-border",
                )}
              />
            )}
            <span
              aria-hidden
              className={cn(
                "stage-marker relative z-10 mt-0.5 flex size-10 shrink-0 items-center justify-center text-sm font-bold",
                done
                  ? "border-safe bg-safe text-background"
                  : current
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted text-muted-foreground",
              )}
            >
              {done ? <Check className="size-4" strokeWidth={3} /> : <span>{i + 1}</span>}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-baseline gap-x-2.5">
                <h3
                  className={cn(
                    "text-[1.05rem] font-semibold",
                    !reached && !done && "text-muted-foreground",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <BrandIcon name={stageIcons[stage]} className="size-5 text-primary-strong" />
                    {t(labelKey[stage])}
                  </span>
                </h3>
                {current && (
                  <span className="text-[0.68rem] font-bold tracking-[0.08em] text-primary uppercase">
                    {t("ladder.current")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t(descKey[stage])}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
