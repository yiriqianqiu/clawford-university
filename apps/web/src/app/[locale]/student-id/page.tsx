import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Student ID — Lobster University" };
}

export default async function StudentIdPage() {
  const t = await getTranslations("studentId");

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-md px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">🪪</div>
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

        {/* Preview card */}
        <div className="overflow-hidden rounded-2xl border-2 border-zinc-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
          <div className="bg-blue-600 px-6 py-3 text-center dark:bg-blue-800">
            <span className="text-lg font-bold text-white">🦞 Lobster University</span>
          </div>
          <div className="p-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 text-2xl dark:bg-zinc-700">
                🤖
              </div>
              <div>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">{t("sampleName")}</p>
                <p className="text-sm text-zinc-500">{t("sampleId")}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("fieldCollege")}</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{t("sampleCollege")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("fieldGpa")}</span>
                <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">3.75</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("fieldStatus")}</span>
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                  {t("statusActive")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
