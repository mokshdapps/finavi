import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore, uid } from "@/lib/store";
import { PageHeader } from "@/components/AppShell";
import {
  Button,
  EmptyState,
  Field,
  Meter,
  MoneyInput,
  Note,
  Page,
  Section,
  TextInput,
} from "@/components/ui-kit";

const quick = [5, 20, 50];

export function JarsPage() {
  const { t, money } = useI18n();
  const { data, update } = useStore();
  const [name, setName] = useState("");
  const [target, setTarget] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const active = data.jars.filter((j) => !j.archived);
  const archived = data.jars.filter((j) => j.archived);

  const create = () => {
    const clean = name.trim().slice(0, 60);
    if (!clean) {
      setError(t("common.required"));
      return;
    }
    setError(null);
    update((d) => ({
      ...d,
      jars: [
        {
          id: uid(),
          name: clean,
          target: target && target > 0 ? target : null,
          amount: 0,
          archived: false,
          createdAt: new Date().toISOString(),
        },
        ...d.jars,
      ],
    }));
    setName("");
    setTarget(null);
  };

  const addTo = (id: string, delta: number) =>
    update((d) => ({
      ...d,
      jars: d.jars.map((j) => (j.id === id ? { ...j, amount: Math.max(0, j.amount + delta) } : j)),
    }));

  return (
    <Page>
      <PageHeader title={t("jars.title")} back="/goals" />

      <Section title={t("jars.new")}>
        <div className="space-y-4">
          <Field
            label={t("jars.name")}
            hint={t("jars.suggest")}
            htmlFor="jarName"
            error={error ?? undefined}
          >
            <TextInput
              id="jarName"
              value={name}
              maxLength={60}
              aria-invalid={!!error}
              placeholder={t("jars.namePlaceholder")}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <div className="flex flex-wrap items-end gap-2">
            <div className="w-44">
              <Field label={`${t("jars.target")} (${t("common.optional")})`} htmlFor="jarTarget">
                <MoneyInput
                  id="jarTarget"
                  value={target}
                  onValueChange={setTarget}
                  placeholder="0"
                />
              </Field>
            </div>
            <Button onClick={create}>{t("jars.create")}</Button>
          </div>
        </div>
      </Section>

      <Section title={t("goals.jars")}>
        {active.length === 0 ? (
          <EmptyState title={t("jars.emptyTitle")} body={t("jars.emptyBody")} />
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {active.map((j) => (
              <article key={j.id} className="py-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold">{j.name}</h3>
                  <span className="num shrink-0 font-semibold">
                    {money(j.amount)}
                    {j.target ? (
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        / {money(j.target)}
                      </span>
                    ) : null}
                  </span>
                </div>

                {j.target ? (
                  <div className="mt-3">
                    <Meter
                      value={j.amount}
                      max={j.target}
                      label={j.name}
                      tone={j.amount >= j.target ? "safe" : "primary"}
                    />
                    <p className="num mt-1.5 text-xs text-muted-foreground">
                      {j.amount >= j.target
                        ? t("common.done")
                        : `${money(j.target - j.amount)} ${t("common.remaining")}`}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">{t("jars.noTarget")}</p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {quick.map((q) => (
                    <Button
                      key={q}
                      variant="secondary"
                      size="sm"
                      className="num"
                      onClick={() => addTo(j.id, q)}
                    >
                      + {money(q)}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addTo(j.id, -20)}
                    disabled={j.amount <= 0}
                  >
                    − {money(20)}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      update((d) => ({
                        ...d,
                        jars: d.jars.map((x) => (x.id === j.id ? { ...x, archived: true } : x)),
                      }))
                    }
                  >
                    {t("common.archive")}
                  </Button>
                  <button
                    type="button"
                    aria-label={`${t("common.delete")} ${j.name}`}
                    onClick={() => setConfirmId(j.id)}
                    className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {confirmId === j.id && (
                  <div className="mt-3">
                    <Note tone="danger">{t("jars.deleteConfirm")}</Note>
                    <div className="mt-2 flex gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          update((d) => ({ ...d, jars: d.jars.filter((x) => x.id !== j.id) }));
                          setConfirmId(null);
                        }}
                      >
                        {t("common.delete")}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmId(null)}>
                        {t("common.cancel")}
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </Section>

      {archived.length > 0 && (
        <Section title={t("common.archived")}>
          <ul className="divide-y divide-border border-y border-border">
            {archived.map((j) => (
              <li key={j.id} className="flex items-center justify-between gap-3 py-3">
                <span className="text-[0.95rem] text-muted-foreground">
                  {j.name} · <span className="num">{money(j.amount)}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    update((d) => ({
                      ...d,
                      jars: d.jars.map((x) => (x.id === j.id ? { ...x, archived: false } : x)),
                    }))
                  }
                >
                  {t("common.restore")}
                </Button>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </Page>
  );
}
