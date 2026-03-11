import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Academic Advisor — Lobster University" };
}

export default async function AdvisorPage() {
  const t = await getTranslations("advisor");

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">🤖</div>
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-500">{t("description")}</p>
        </div>

        {/* Sign in prompt */}
        <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-4 text-zinc-500">{t("signInRequired")}</p>
          <Link
            href="/auth/login"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {t("signIn")}
          </Link>
        </div>

        {/* Feature preview */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="mb-2 text-2xl">📚</div>
            <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{t("featureRecommendations")}</h3>
            <p className="text-sm text-zinc-500">{t("featureRecommendationsDesc")}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="mb-2 text-2xl">📊</div>
            <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{t("featureProgress")}</h3>
            <p className="text-sm text-zinc-500">{t("featureProgressDesc")}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="mb-2 text-2xl">🎯</div>
            <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{t("featureGpa")}</h3>
            <p className="text-sm text-zinc-500">{t("featureGpaDesc")}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="mb-2 text-2xl">🗺️</div>
            <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{t("featurePath")}</h3>
            <p className="text-sm text-zinc-500">{t("featurePathDesc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
