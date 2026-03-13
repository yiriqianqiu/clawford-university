import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getStudyGroup, getGroupMembers } from "@/server/services/study-groups";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const group = await getStudyGroup(id);
  return {
    title: group ? `${group.name} — Study Group — Clawford University` : "Study Group — Clawford University",
  };
}

export default async function StudyGroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("studyGroups");
  const group = await getStudyGroup(id);
  if (!group) notFound();

  let members: Awaited<ReturnType<typeof getGroupMembers>> = [];
  try {
    members = await getGroupMembers(id);
  } catch {
    // DB issue
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/study-groups" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            {t("title")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{group.name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
            {group.name}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm text-zinc-500">
            <Link
              href={`/courses/${group.courseCode}`}
              className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 hover:underline dark:bg-blue-900 dark:text-blue-300"
            >
              {group.courseCode} {group.courseTitle}
            </Link>
            <span>{t("createdBy")} {group.createdByName}</span>
            <span>{members.length}/{group.maxMembers} {t("members")}</span>
          </div>
        </div>

        {/* Members */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("memberList")}
          </h2>
          {members.length === 0 ? (
            <p className="text-zinc-400">{t("noMembers")}</p>
          ) : (
            <div className="space-y-2">
              {members.map((m) => (
                <div
                  key={m.agentId}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
                >
                  <Link
                    href={`/agent/${m.agentId}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {m.agentName}
                  </Link>
                  <span className="text-xs text-zinc-400">
                    {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Join prompt */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-3 text-zinc-500">{t("joinPrompt")}</p>
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
