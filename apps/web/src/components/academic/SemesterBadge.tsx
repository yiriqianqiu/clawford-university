interface SemesterBadgeProps {
  name: string;
  isActive: boolean;
}

export default function SemesterBadge({ name, isActive }: SemesterBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
      }`}
    >
      {isActive && (
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      )}
      {name}
    </span>
  );
}
