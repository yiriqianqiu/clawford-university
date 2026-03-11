import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getFaculty } from "@/server/services/faculty";
import { getInstructorRatingStats } from "@/server/services/course-reviews";
import { listOfficeHoursForFaculty } from "@/server/services/office-hours";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const member = await getFaculty(id);
  return {
    title: member ? `${member.name} — Faculty — Lobster University` : "Faculty — Lobster University",
  };
}

export default async function FacultyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("faculty");
  const member = await getFaculty(id);
  if (!member) notFound();

  let ratingStats = { avgRating: 0, reviewCount: 0 };
  let hours: Awaited<ReturnType<typeof listOfficeHoursForFaculty>> = [];
  try {
    ratingStats = await getInstructorRatingStats(id);
    hours = await listOfficeHoursForFaculty(id);
  } catch {
    // DB not seeded
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/faculty" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            {t("title")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{member.name}</span>
        </nav>

        <div className="mb-8 flex items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-3xl dark:bg-zinc-800">
            {member.avatarUrl ? (
              <img src={member.avatarUrl} alt={member.name} className="h-20 w-20 rounded-full" />
            ) : (
              <span>👨‍🏫</span>
            )}
          </div>
          <div>
            <h1 className="mb-1 text-3xl font-bold text-zinc-900 dark:text-white">
              {member.name}
            </h1>
            <p className="mb-1 text-lg text-zinc-500">{member.title}</p>
            <p className="text-sm text-zinc-400">
              {member.collegeName} · {member.departmentName}
            </p>
          </div>
        </div>

        {/* Teaching Rating */}
        {ratingStats.reviewCount > 0 && (
          <div className="mb-6 flex items-center gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{ratingStats.avgRating.toFixed(1)}</div>
              <div className="text-xs text-zinc-500">{"★".repeat(Math.round(ratingStats.avgRating))} avg</div>
            </div>
            <div className="text-sm text-zinc-500">
              {ratingStats.reviewCount} {ratingStats.reviewCount === 1 ? "review" : "reviews"} from students
            </div>
          </div>
        )}

        {member.bio && (
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
              {t("bio")}
            </h2>
            <p className="text-zinc-600 leading-relaxed dark:text-zinc-400">{member.bio}</p>
          </section>
        )}

        {/* Office Hours */}
        {hours.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
              Office Hours
            </h2>
            <div className="space-y-2">
              {hours.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-sm font-medium text-zinc-900 dark:text-white">
                      {h.dayName}
                    </span>
                    <span className="text-sm text-zinc-500">
                      {h.startTime} — {h.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${h.isVirtual ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                      {h.isVirtual ? "Virtual" : h.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
