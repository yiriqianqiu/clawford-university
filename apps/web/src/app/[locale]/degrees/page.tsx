import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listDegreePrograms } from "@/server/services/degrees";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("degrees");
  return { title: t("title"), description: t("description") };
}

export default async function DegreesPage() {
  const t = await getTranslations("degrees");

  let programs: Awaited<ReturnType<typeof listDegreePrograms>> = [];
  try {
    programs = await listDegreePrograms();
  } catch {
    // DB not seeded
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mb-8 text-lg text-zinc-500">{t("description")}</p>

        {programs.length === 0 ? (
          <p className="text-zinc-400">{t("empty")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {programs.map((p) => (
              <Link
                key={p.id}
                href={`/degrees/${p.slug}`}
                className="group rounded-xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-2xl">{p.collegeEmoji}</span>
                  <div>
                    <h2 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {p.name}
                    </h2>
                    <p className="text-sm text-zinc-400">{p.collegeName}</p>
                  </div>
                </div>
                <p className="mb-3 text-sm text-zinc-500 line-clamp-2">{p.description}</p>
                <div className="flex gap-4 text-xs text-zinc-400">
                  <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                    {p.type === "bachelor" ? t("typeBachelor") : t("typeCertificate")}
                  </span>
                  <span>{p.requiredCredits} {t("credits")}</span>
                  <span>{t("minGpa")} {(p.minGpa / 100).toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
