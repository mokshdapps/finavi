import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { creditLessons, creditUnits } from "@/data/credit-course";
import { PageHeader } from "@/components/AppShell";
import { Button, Meter, Note, Page, Section } from "@/components/ui-kit";

export function CreditCourse() {
  const { t, lang } = useI18n();
  const { data } = useStore();
  const read = data.learnRead;
  const doneCount = creditLessons.filter((l) => read.includes(l.id)).length;
  const nextLesson = creditLessons.find((l) => !read.includes(l.id));

  return (
    <Page>
      <PageHeader title={t("learn.courseTitle")} intro={t("learn.courseIntro")} back="/learn" />

      <Section>
        <Meter value={doneCount} max={creditLessons.length} label={t("learn.credit")} tone="safe" />
        <p className="num mt-2 text-sm text-muted-foreground">
          {t("learn.progress", { done: doneCount, total: creditLessons.length })}
        </p>
        {nextLesson ? (
          <Button asChild className="mt-4">
            <Link to="/learn/credit/$lessonId" params={{ lessonId: nextLesson.id }}>
              {doneCount === 0 ? t("learn.start") : t("learn.continueCourse")}
            </Link>
          </Button>
        ) : (
          <div className="mt-4">
            <Note tone="safe">{t("learn.courseDone")}</Note>
          </div>
        )}
      </Section>

      {creditUnits.map((unit, ui) => {
        const unitDone = unit.lessons.filter((l) => read.includes(l.id)).length;
        return (
          <Section key={unit.id}>
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[0.78rem] font-semibold tracking-[0.09em] text-muted-foreground uppercase">
                {t("learn.unit")} {ui + 1}
              </p>
              <span className="num text-xs font-semibold text-muted-foreground">
                {t("learn.lessonsDone", { done: unitDone, total: unit.lessons.length })}
              </span>
            </div>
            <h2 className="mt-1 text-xl leading-snug font-semibold">{unit.title[lang]}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {unit.summary[lang]}
            </p>

            <ol className="mt-4 divide-y divide-border border-y border-border">
              {unit.lessons.map((lesson) => {
                const isRead = read.includes(lesson.id);
                const number = creditLessons.findIndex((l) => l.id === lesson.id) + 1;
                return (
                  <li key={lesson.id}>
                    <Link
                      to="/learn/credit/$lessonId"
                      params={{ lessonId: lesson.id }}
                      className="group flex min-h-[58px] items-center gap-4 py-3 transition-colors hover:bg-muted/60"
                    >
                      <span
                        className={
                          "num flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold " +
                          (isRead
                            ? "border-transparent bg-primary text-primary-foreground"
                            : "border-border-strong text-muted-foreground")
                        }
                        aria-hidden
                      >
                        {isRead ? <Check className="size-4" /> : number}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium group-hover:underline">
                          {lesson.title[lang]}
                        </span>
                        <span className="num mt-0.5 block text-xs text-muted-foreground">
                          {t("learn.minutes", { n: lesson.minutes })}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </Section>
        );
      })}

      <Section>
        <Note tone="neutral">{t("common.disclaimer")}</Note>
      </Section>
    </Page>
  );
}
