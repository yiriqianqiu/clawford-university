import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("certificates");
  return { title: t("title") };
}

export default async function CertificatesPage() {
  const t = await getTranslations("certificates");

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mb-8 text-zinc-500">{t("description")}</p>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 text-4xl">🎓</div>
          <p className="mb-4 text-zinc-500">{t("signInRequired")}</p>
          <Link
            href="/auth/login"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {t("signIn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
