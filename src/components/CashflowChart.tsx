import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { monthlyCashflow } from "@/lib/money-journey";
import { Button, Segmented, Stat } from "./ui-kit";

export function CashflowChart() {
  const { data } = useStore();
  const { t, money, monthName } = useI18n();
  const [mode, setMode] = useState<"flow" | "room">("flow");
  const [selected, setSelected] = useState(0);
  const model = monthlyCashflow(data);
  const row = model.rows[selected];
  const values = model.rows.flatMap((item) =>
    mode === "flow" ? [item.income ?? 0, item.expenses] : [item.reserve ?? 0],
  );
  const min = Math.min(0, ...values);
  const max = Math.max(100, ...values);
  const span = max - min;
  const y = (value: number) => 190 - ((value - min) / span) * 156;
  const x = (index: number) => 44 + index * 47;
  const reserveSegments: string[] = [];
  let segment = "";
  model.rows.forEach((item, index) => {
    if (item.reserve === null) {
      if (segment) reserveSegments.push(segment);
      segment = "";
    } else segment += `${segment ? " L" : "M"}${x(index)} ${y(item.reserve)}`;
  });
  if (segment) reserveSegments.push(segment);

  if (data.income.every((value) => value === null) && !data.budget.bills.length)
    return (
      <section className="mt-6 border-y border-border py-5" aria-labelledby="cashflow-title">
        <h2 id="cashflow-title" className="text-xl font-semibold">
          {t("journey.chartTitle")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("journey.chartIncomplete")}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button asChild variant="ghost" size="sm" className="px-0 text-primary-strong">
            <Link to="/" search={{ task: "income" }}>
              {t("journey.action.income")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="px-0 text-primary-strong">
            <Link to="/" search={{ task: "bills" }}>
              {t("journey.action.bills")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    );

  return (
    <section aria-labelledby="cashflow-title" className="mt-8 border-y border-border py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 id="cashflow-title" className="max-w-lg text-xl font-semibold">
          {t("journey.chartTitle")}
        </h2>
        <Button asChild variant="ghost" size="sm" className="px-0 text-primary-strong">
          <Link to="/" search={{ task: "income" }}>
            {t("common.edit")}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {t("journey.chartIntro")}
      </p>
      <div className="mt-5 max-w-xl">
        <Segmented
          label={t("journey.chartTitle")}
          value={mode}
          onChange={setMode}
          options={[
            { value: "flow", label: t("journey.chartFlow") },
            { value: "room", label: t("journey.chartRoom") },
          ]}
        />
      </div>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-2 w-4 bg-primary" />
          {t(mode === "flow" ? "journey.chartIncome" : "journey.chartReserve")}
        </span>
        {mode === "flow" && (
          <span className="flex items-center gap-2">
            <span className="w-5 border-t-2 border-dashed border-foreground" />
            {t("journey.chartExpenses")}
          </span>
        )}
      </div>
      <div className="mt-2 overflow-x-auto">
        <svg
          viewBox="0 0 610 230"
          className="block aspect-[610/230] w-full"
          role="img"
          aria-label={t(mode === "flow" ? "journey.chartFlow" : "journey.chartRoom")}
        >
          {[0, 0.5, 1].map((fraction) => {
            const value = min + span * fraction;
            return (
              <g key={fraction}>
                <line x1="32" x2="580" y1={y(value)} y2={y(value)} className="stroke-border" />
                <text x="30" y={y(value) - 5} className="fill-muted-foreground text-[10px]">
                  {money(value)}
                </text>
              </g>
            );
          })}
          {mode === "flow" ? (
            <>
              {model.rows.map((item, index) =>
                item.income !== null ? (
                  <rect
                    key={item.month}
                    x={x(index) - 11}
                    y={y(item.income)}
                    width="22"
                    height={Math.max(0, y(0) - y(item.income))}
                    rx="2"
                    className={selected === index ? "fill-primary-strong" : "fill-primary/65"}
                  >
                    <title>
                      {monthName(item.month, false)}: {money(item.income)}
                    </title>
                  </rect>
                ) : (
                  <text
                    key={item.month}
                    x={x(index)}
                    y={y(0) - 5}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[12px]"
                  >
                    ?
                  </text>
                ),
              )}
              {data.budget.bills.length > 0 && (
                <line
                  x1="32"
                  x2="580"
                  y1={y(model.expenses)}
                  y2={y(model.expenses)}
                  strokeWidth="2"
                  strokeDasharray="7 5"
                  className="stroke-foreground"
                />
              )}
            </>
          ) : (
            <>
              <line
                x1="32"
                x2="580"
                y1={y(0)}
                y2={y(0)}
                className="stroke-border-strong"
                strokeDasharray="5 4"
              />
              {reserveSegments.map((path) => (
                <path key={path} d={path} fill="none" strokeWidth="3" className="stroke-primary" />
              ))}
              {model.rows.map(
                (item, index) =>
                  item.reserve !== null && (
                    <circle
                      key={item.month}
                      cx={x(index)}
                      cy={y(item.reserve)}
                      r={selected === index ? 5 : 3}
                      className={item.reserve < 0 ? "fill-danger" : "fill-safe"}
                    >
                      <title>
                        {monthName(item.month, false)}: {money(item.reserve)}
                      </title>
                    </circle>
                  ),
              )}
            </>
          )}
          {model.rows.map((item, index) => (
            <text
              key={item.month}
              x={x(index)}
              y="218"
              textAnchor="middle"
              className="fill-muted-foreground text-[11px]"
            >
              {monthName(item.month)}
            </text>
          ))}
        </svg>
      </div>
      <div className="grid grid-cols-6 gap-1 sm:grid-cols-12" aria-label={t("hb.plan.col.month")}>
        {model.rows.map((item, index) => (
          <Button
            key={item.month}
            variant="ghost"
            size="sm"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
            className={`min-w-0 px-1 text-xs ${selected === index ? "bg-primary-soft text-primary-strong" : ""}`}
          >
            {monthName(item.month)}
          </Button>
        ))}
      </div>
      <dl
        aria-live="polite"
        className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4"
      >
        <Stat
          size="sm"
          label={row ? monthName(row.month, false) : ""}
          value={
            row?.income !== null && row?.income !== undefined
              ? money(row.income)
              : t("journey.chartMissing")
          }
        />
        <Stat
          size="sm"
          label={t("journey.chartExpenses")}
          value={data.budget.bills.length ? money(model.expenses) : t("journey.chartMissing")}
        />
        <Stat
          size="sm"
          label={t("journey.chartSurplus")}
          value={
            row?.delta !== null && row?.delta !== undefined
              ? money(row.delta)
              : t("journey.chartMissing")
          }
          tone={row?.delta === null ? "default" : (row?.delta ?? 0) < 0 ? "danger" : "safe"}
        />
        <Stat
          size="sm"
          label={t("journey.chartReserve")}
          value={
            row?.reserve !== null && row?.reserve !== undefined
              ? money(row.reserve)
              : t("journey.chartMissing")
          }
          tone={row?.reserve === null ? "default" : (row?.reserve ?? 0) < 0 ? "danger" : "primary"}
        />
      </dl>
      {model.complete ? (
        <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
          <Stat
            size="sm"
            label={t("journey.yearEnd")}
            value={money(model.endReserve ?? 0)}
            tone={(model.endReserve ?? 0) < 0 ? "danger" : "safe"}
          />
          <Stat
            size="sm"
            label={t("journey.lowestReserve")}
            value={money(model.lowest ?? 0)}
            tone={(model.lowest ?? 0) < 0 ? "danger" : "primary"}
          />
        </dl>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">{t("journey.chartIncomplete")}</p>
      )}
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{t("journey.chartNote")}</p>
    </section>
  );
}
