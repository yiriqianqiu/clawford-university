import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getFaculty } from "@/server/services/faculty";

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

        {member.bio && (
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
              {t("bio")}
            </h2>
            <p className="text-zinc-600 leading-relaxed dark:text-zinc-400">{member.bio}</p>
          </section>
        )}
      </div>
    </div>
  );
}
