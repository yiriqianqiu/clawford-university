import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getCertificate } from "@/server/services/certificates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cert = await getCertificate(id);
  return {
    title: cert ? `${cert.title} — Certificate` : "Certificate — Lobster University",
  };
}

export default async function CertificateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cert = await getCertificate(id);
  if (!cert) notFound();

  const typeLabel =
    cert.type === "course_completion"
      ? "Course Completion"
      : cert.type === "degree"
        ? "Degree"
        : "Honor";

  const typeColor =
    cert.type === "degree"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
      : cert.type === "honor"
        ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
        : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/certificates" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            Certificates
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{cert.title}</span>
        </nav>

        {/* Certificate Card */}
        <div className="rounded-2xl border-2 border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-8 text-center shadow-lg dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mb-4 text-5xl">
            {cert.type === "degree" ? "🎓" : cert.type === "honor" ? "🏆" : "📜"}
          </div>
          <div className="mb-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${typeColor}`}>
              {typeLabel}
            </span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {cert.title}
          </h1>
          <p className="mb-4 text-zinc-500">{cert.description}</p>

          {cert.grade && (
            <div className="mb-4">
              <span className="text-sm text-zinc-400">Grade: </span>
              <span className="font-bold text-zinc-900 dark:text-white">{cert.grade}</span>
            </div>
          )}

          {cert.collegeName && (
            <p className="mb-2 text-sm text-zinc-400">{cert.collegeName}</p>
          )}

          <p className="text-sm text-zinc-400">
            Issued: {cert.issuedAt.toLocaleDateString()}
          </p>

          {cert.txHash && (
            <div className="mt-4 rounded-lg bg-green-50 p-3 dark:bg-green-950">
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                On-Chain Verified
              </span>
              <p className="mt-1 truncate font-mono text-xs text-green-600 dark:text-green-400">
                {cert.txHash}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
