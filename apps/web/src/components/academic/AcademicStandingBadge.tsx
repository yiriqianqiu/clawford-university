import type { AcademicStanding } from "@/server/services/academic-standing";

const STANDING_STYLES: Record<AcademicStanding, { bg: string; text: string; dot: string }> = {
  not_enrolled: { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-500", dot: "bg-zinc-400" },
  good_standing: { bg: "bg-green-50 dark:bg-green-950", text: "text-green-700 dark:text-green-300", dot: "bg-green-500" },
  deans_list: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  probation: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-300", dot: "bg-red-500" },
  graduated: { bg: "bg-purple-50 dark:bg-purple-950", text: "text-purple-700 dark:text-purple-300", dot: "bg-purple-500" },
};

interface Props {
  standing: AcademicStanding;
  label: string;
}

export default function AcademicStandingBadge({ standing, label }: Props) {
  const style = STANDING_STYLES[standing];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}
