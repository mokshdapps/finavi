import { Slot } from "@radix-ui/react-slot";
import { Link } from "@tanstack/react-router";
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import { useId } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-strong active:bg-primary-strong disabled:bg-border-strong disabled:text-background",
  secondary:
    "bg-surface text-foreground border border-border-strong hover:bg-muted active:bg-surface-sunk disabled:text-muted-foreground",
  ghost: "text-foreground hover:bg-muted active:bg-surface-sunk disabled:text-muted-foreground",
  danger:
    "bg-surface text-danger border border-danger/40 hover:bg-danger-soft active:bg-danger-soft disabled:text-muted-foreground disabled:border-border",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-3 py-2 text-sm sm:min-h-9",
  md: "min-h-11 px-4 py-2 text-[0.95rem]",
  lg: "min-h-13 px-5 py-2.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  full,
  asChild,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      {...props}
      className={cn(
        "inline-flex max-w-full items-center justify-center gap-2 rounded-md text-center leading-snug break-words font-medium transition-colors duration-150 [&_svg]:shrink-0",
        "disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        full && "w-full",
        className,
      )}
    />
  );
}

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-4xl px-5 pb-10 sm:px-8", className)}>{children}</div>
  );
}

export function Section({
  title,
  action,
  children,
  className,
  description,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mt-8 first:mt-6", className)}>
      {(title || action) && (
        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 sm:flex sm:justify-between sm:gap-4">
          {title && (
            <h2 className="min-w-0 text-sm font-semibold text-muted-foreground">{title}</h2>
          )}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {description && (
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {children}
    </section>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface", className)}>{children}</div>
  );
}

export function List({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ul className={cn("divide-y divide-border border-y border-border", className)}>{children}</ul>
  );
}

export function LinkRow({
  to,
  title,
  description,
  right,
  icon,
}: {
  to: string;
  title: string;
  description?: string;
  right?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <li>
      <Link
        to={to}
        className="group flex min-h-[60px] items-center gap-4 py-3.5 transition-colors hover:bg-muted/60 active:bg-muted"
      >
        {icon && <span className="shrink-0 text-primary">{icon}</span>}
        <span className="min-w-0 flex-1">
          <span className="block font-medium">{title}</span>
          {description && (
            <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
              {description}
            </span>
          )}
        </span>
        {right}
        <ChevronRight
          className="size-5 shrink-0 text-border-strong transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-muted-foreground"
          aria-hidden
        />
      </Link>
    </li>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "default",
  size = "md",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "primary" | "safe" | "danger" | "caution";
  size?: "sm" | "md" | "lg";
}) {
  const tones = {
    default: "text-foreground",
    primary: "text-primary",
    safe: "text-safe",
    danger: "text-danger",
    caution: "text-caution",
  } as const;
  const sizeCls = { sm: "text-xl", md: "text-2xl", lg: "text-4xl" }[size];
  return (
    <div>
      <dt className="text-[0.8rem] font-medium text-muted-foreground">{label}</dt>
      <dd className={cn("num mt-1 font-semibold", sizeCls, tones[tone])}>{value}</dd>
      {hint && <p className="mt-1 text-xs leading-snug text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Meter({
  value,
  max,
  label,
  tone = "primary",
}: {
  value: number;
  max: number;
  label: string;
  tone?: "primary" | "safe";
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-2.5 w-full overflow-hidden rounded-full bg-surface-sunk"
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-300",
          tone === "safe" ? "bg-safe" : "bg-primary",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Note({
  children,
  tone = "info",
  title,
}: {
  children: ReactNode;
  tone?: "info" | "caution" | "danger" | "safe" | "neutral";
  title?: string;
}) {
  const tones = {
    info: "border-info/25 bg-info-soft text-info",
    caution: "border-caution/30 bg-caution-soft text-caution",
    danger: "border-danger/25 bg-danger-soft text-danger",
    safe: "border-safe/25 bg-safe-soft text-safe",
    neutral: "border-border bg-muted text-muted-foreground",
  } as const;
  return (
    <div className={cn("rounded-md border-l-3 px-4 py-3 text-sm leading-relaxed", tones[tone])}>
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div className="text-foreground/85">{children}</div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-y border-border py-10 text-center">
      <p className="font-medium">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
      {action && <div className="mt-5 flex justify-center gap-2">{action}</div>}
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  children: ReactNode;
  htmlFor?: string | undefined;
}) {
  return (
    <div className="min-w-0 w-full">
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{hint}</p>}
      <div className="mt-1.5">{children}</div>
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "h-11 min-w-0 w-full rounded-md border border-border-strong bg-surface px-3 text-base transition-colors placeholder:text-muted-foreground/70 hover:border-foreground/30 focus:border-primary focus:outline-none aria-[invalid=true]:border-danger";

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, className)} />;
}

export function MoneyInput({
  value,
  onValueChange,
  className,
  id,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  value: number | null;
  onValueChange: (n: number | null) => void;
}) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <div className="relative">
      <span
        aria-hidden
        className="num pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
      >
        $
      </span>
      <input
        {...props}
        id={inputId}
        inputMode="decimal"
        type="text"
        value={value === null ? "" : String(value)}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.]/g, "");
          if (raw === "") return onValueChange(null);
          const n = Number(raw);
          onValueChange(Number.isFinite(n) ? n : null);
        }}
        className={cn(inputCls, "num pl-7", className)}
      />
    </div>
  );
}

export function PercentInput({
  value,
  onValueChange,
  className,
  id,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  value: number | null;
  onValueChange: (n: number | null) => void;
}) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <div className="relative">
      <input
        {...props}
        id={inputId}
        inputMode="decimal"
        type="text"
        value={value === null ? "" : String(value)}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.]/g, "");
          if (raw === "") return onValueChange(null);
          const n = Number(raw);
          onValueChange(Number.isFinite(n) ? n : null);
        }}
        className={cn(inputCls, "num pr-8", className)}
      />
      <span
        aria-hidden
        className="num pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
      >
        %
      </span>
    </div>
  );
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid w-full grid-cols-2 gap-1 rounded-md bg-surface-sunk p-1 sm:flex sm:flex-wrap"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-11 min-w-0 flex-1 rounded-sm px-2 py-1.5 text-sm font-medium transition-colors duration-150",
              active
                ? "bg-surface text-foreground shadow-control hover:bg-surface"
                : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {o.label}
          </Button>
        );
      })}
    </div>
  );
}

export function Stepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
  id,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label: string;
  id?: string;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className="flex h-11 w-full items-center justify-between rounded-md border border-border-strong bg-surface">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label={`${label} −1`}
        className="h-full w-12 rounded-l-md text-xl text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
      >
        −
      </button>
      <input
        id={id}
        aria-label={label}
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value.replace(/\D/g, ""));
          if (Number.isFinite(n) && n > 0) onChange(clamp(n));
        }}
        className="num h-full w-full min-w-0 border-x border-border bg-transparent text-center text-base font-semibold focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label={`${label} +1`}
        className="h-full w-12 rounded-r-md text-xl text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}

export function YesNo({
  value,
  onChange,
  label,
  yesLabel,
  noLabel,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <fieldset className="flex flex-wrap items-center justify-between gap-3 py-3">
      <legend className="sr-only">{label}</legend>
      <span className="flex-1 text-[0.95rem]">{label}</span>
      <div className="flex shrink-0 gap-1 rounded-md bg-surface-sunk p-1">
        {[
          { v: true, l: yesLabel },
          { v: false, l: noLabel },
        ].map(({ v, l }) => (
          <button
            key={String(v)}
            type="button"
            role="radio"
            aria-checked={value === v}
            onClick={() => onChange(v)}
            className={cn(
              "min-h-9 min-w-16 rounded-sm px-3 text-sm font-medium transition-colors duration-150",
              value === v
                ? "bg-surface text-foreground shadow-control"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
