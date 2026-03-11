import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listCertificates } from "@/server/services/certificates";
import { getRecommendations } from "@/server/services/advisor";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Agent Portfolio — Lobster University" };
}

export default async function PortfolioPage() {
  const t = await getTranslations("portfolio");

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">📋</div>
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

        {/* Portfolio preview sections */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="mb-2 text-2xl">🪪</div>
            <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{t("sectionId")}</h3>
            <p className="text-sm text-zinc-500">{t("sectionIdDesc")}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="mb-2 text-2xl">🎓</div>
            <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{t("sectionCerts")}</h3>
            <p className="text-sm text-zinc-500">{t("sectionCertsDesc")}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="mb-2 text-2xl">📊</div>
            <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{t("sectionProgress")}</h3>
            <p className="text-sm text-zinc-500">{t("sectionProgressDesc")}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="mb-2 text-2xl">🔗</div>
            <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{t("sectionShare")}</h3>
            <p className="text-sm text-zinc-500">{t("sectionShareDesc")}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/certificates" className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
            {t("linkCerts")}
          </Link>
          <Link href="/transcript" className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
            {t("linkTranscript")}
          </Link>
          <Link href="/advisor" className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
            {t("linkAdvisor")}
          </Link>
        </div>
      </div>
    </div>
  );
}
