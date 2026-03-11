import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getDegreeProgram, getDegreeRequirements } from "@/server/services/degrees";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await getDegreeProgram(slug);
  return {
    title: program ? `${program.name} — Lobster University` : "Degree — Lobster University",
  };
}

export default async function DegreeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("degrees");
  const program = await getDegreeProgram(slug);
  if (!program) notFound();

  const requirements = await getDegreeRequirements(program.id);
  const requiredCourses = requirements.filter((r) => r.courseId && !r.isElective);
  const electives = requirements.filter((r) => r.isElective);

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/degrees" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            {t("title")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{program.name}</span>
        </nav>

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {program.type === "bachelor" ? t("typeBachelor") : t("typeCertificate")}
            </span>
            <span className="text-sm text-zinc-400">{program.collegeName}</span>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-white">
            {program.name}
          </h1>
          <p className="text-lg text-zinc-500">{program.description}</p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="text-sm text-zinc-500">{t("requiredCredits")}</div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {program.requiredCredits}
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="text-sm text-zinc-500">{t("minimumGpa")}</div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {(program.minGpa / 100).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Required Courses */}
        {requiredCourses.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              {t("requiredCoursesTitle")}
            </h2>
            <div className="space-y-2">
              {requiredCourses.map((req) => (
                <Link
                  key={req.id}
                  href={`/courses/${req.courseCode}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                >
                  <div>
                    <span className="mr-2 font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                      {req.courseCode}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">{req.courseTitle}</span>
                  </div>
                  <span className="text-sm text-zinc-400">
                    {req.courseCredits} {t("credits")}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Electives */}
        {electives.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              {t("electivesTitle")}
            </h2>
            <div className="space-y-2">
              {electives.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {req.departmentName ? `${req.departmentName} — ` : ""}
                    {req.minCredits} {t("credits")} {t("electiveLabel")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
