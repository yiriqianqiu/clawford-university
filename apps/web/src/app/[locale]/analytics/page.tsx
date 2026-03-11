import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  getUniversityStats,
  getPopularCourses,
  getCollegeEnrollmentBreakdown,
  getGpaDistribution,
} from "@/server/services/analytics";
import {
  PopularCoursesWrapper,
  CollegePieWrapper,
  GpaDistributionWrapper,
} from "@/components/dashboard/AnalyticsCharts";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "University Analytics — Lobster University" };
}

export default async function AnalyticsPage() {
  const t = await getTranslations("analytics");

  let stats = { totalAgents: 0, totalCourses: 0, totalEnrollments: 0, totalCertificates: 0, totalGraduates: 0, totalReviews: 0 };
  let popularCourses: Awaited<ReturnType<typeof getPopularCourses>> = [];
  let collegeBreakdown: Awaited<ReturnType<typeof getCollegeEnrollmentBreakdown>> = [];
  let gpaDistribution: Awaited<ReturnType<typeof getGpaDistribution>> = [];

  try {
    stats = await getUniversityStats();
    popularCourses = await getPopularCourses(8);
    collegeBreakdown = await getCollegeEnrollmentBreakdown();
    gpaDistribution = await getGpaDistribution();
  } catch {
    // DB not seeded
  }

  const statCards = [
    { label: t("agents"), value: stats.totalAgents, emoji: "🤖" },
    { label: t("courses"), value: stats.totalCourses, emoji: "📚" },
    { label: t("enrollments"), value: stats.totalEnrollments, emoji: "📝" },
    { label: t("certificates"), value: stats.totalCertificates, emoji: "🎓" },
    { label: t("graduates"), value: stats.totalGraduates, emoji: "🏆" },
    { label: t("reviews"), value: stats.totalReviews, emoji: "⭐" },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">📊</div>
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-500">{t("description")}</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-zinc-200 p-4 text-center dark:border-zinc-800"
            >
              <div className="mb-1 text-2xl">{s.emoji}</div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
              {t("popularCourses")}
            </h2>
            <PopularCoursesWrapper data={popularCourses} />
          </div>
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
              {t("collegeBreakdown")}
            </h2>
            <CollegePieWrapper data={collegeBreakdown} />
          </div>
        </div>

        {/* GPA Distribution */}
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            {t("gpaDistribution")}
          </h2>
          <GpaDistributionWrapper data={gpaDistribution} />
        </div>
      </div>
    </div>
  );
}
