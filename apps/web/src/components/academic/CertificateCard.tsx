import { Link } from "@/i18n/navigation";

interface Props {
  id: string;
  type: string;
  title: string;
  grade?: string | null;
  courseCode?: string | null;
  degreeName?: string | null;
  issuedAt: Date;
  txHash?: string | null;
}

export default function CertificateCard({
  id,
  type,
  title,
  grade,
  courseCode,
  degreeName,
  issuedAt,
  txHash,
}: Props) {
  const emoji = type === "degree" ? "🎓" : type === "honor" ? "🏆" : "📜";
  const typeLabel =
    type === "course_completion"
      ? "Course"
      : type === "degree"
        ? "Degree"
        : "Honor";

  return (
    <Link
      href={`/certificates/${id}`}
      className="group flex items-start gap-4 rounded-xl border border-zinc-200 p-4 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-600"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-2xl dark:bg-zinc-800">
        {emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <h3 className="truncate font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {title}
          </h3>
          {txHash && (
            <span className="shrink-0 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
              On-Chain
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>{typeLabel}</span>
          {courseCode && <span>· {courseCode}</span>}
          {degreeName && <span>· {degreeName}</span>}
          {grade && <span>· Grade: {grade}</span>}
          <span>· {issuedAt.toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
