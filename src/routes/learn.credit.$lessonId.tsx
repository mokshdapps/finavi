import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { creditLessons, findLesson } from "@/data/credit-course";
import { PageHeader } from "@/components/AppShell";
import { Button, Note, Page, Section } from "@/components/ui-kit";

export const Route = createFileRoute("/learn/credit/$lessonId")({
  loader: ({ params }) => {
    const found = findLesson(params.lessonId);
    if (!found) throw notFound();
    return { title: found.lesson.title.en, summary: found.lesson.takeaway.en };
  },
  head: ({ loaderData }) => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: `${loaderData?.title ?? "Credit lesson"} - Credit 101 | Finavi` },
      { name: "description", content: loaderData?.summary ?? "A short credit lesson from Finavi." },
      { property: "og:title", content: `${loaderData?.title ?? "Credit lesson"} - Finavi` },
      {
        property: "og:description",
        content: loaderData?.summary ?? "A short credit lesson from Finavi.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const { t, lang } = useI18n();
  const { data, update } = useStore();
  const found = findLesson(lessonId);

  if (!found) {
    return (
      <Page>
        <PageHeader title={t("learn.credit")} back="/learn/credit" />
      </Page>
    );
  }

  const { lesson, unit, index, prev, next } = found;
  const isRead = data.learnRead.includes(lesson.id);

  const toggle = () =>
    update((d) => ({
      ...d,
      learnRead: d.learnRead.includes(lesson.id)
        ? d.learnRead.filter((x) => x !== lesson.id)
        : [...d.learnRead, lesson.id],
    }));

  return (
    <Page>
      <PageHeader title={lesson.title[lang]} back="/learn/credit" />

      <Section>
        <p className="text-[0.78rem] font-semibold tracking-[0.09em] text-muted-foreground uppercase">
          {unit.title[lang]} · {t("learn.lesson")} {index + 1} {t("common.of")}{" "}
          {creditLessons.length} · {t("learn.minutes", { n: lesson.minutes })}
        </p>

        <div className="mt-4 space-y-4 text-[1.02rem] leading-relaxed text-foreground/85">
          {lesson.body.map((para, k) => (
            <p key={k}>{para[lang]}</p>
          ))}
        </div>

        <div className="mt-6">
          <p className="text-[0.78rem] font-semibold tracking-[0.09em] text-muted-foreground uppercase">
            {t("learn.takeaway")}
          </p>
          <div className="mt-2">
            <Note tone="info">{lesson.takeaway[lang]}</Note>
          </div>
        </div>

        <Button variant={isRead ? "ghost" : "secondary"} className="mt-6" onClick={toggle}>
          {isRead ? <Check className="size-4" aria-hidden /> : null}
          {isRead ? t("learn.readDone") : t("learn.markRead")}
        </Button>
      </Section>

      <Section>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          {prev ? (
            <Button asChild variant="ghost" size="sm">
              <Link to="/learn/credit/$lessonId" params={{ lessonId: prev.id }}>
                <ArrowLeft className="size-4" aria-hidden />
                {t("learn.prev")}
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/learn/credit">
                <ArrowLeft className="size-4" aria-hidden />
                {t("learn.backToCourse")}
              </Link>
            </Button>
          )}

          {next ? (
            <Button asChild size="sm">
              <Link to="/learn/credit/$lessonId" params={{ lessonId: next.id }}>
                {t("learn.next")}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to="/learn/credit">{t("learn.backToCourse")}</Link>
            </Button>
          )}
        </div>
        {next && (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("learn.nextUp")}: {next.title[lang]}
          </p>
        )}
      </Section>
    </Page>
  );
}
