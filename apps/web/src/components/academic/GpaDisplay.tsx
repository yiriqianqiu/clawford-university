interface GpaDisplayProps {
  gpa: number; // stored as GPA * 100, e.g., 350 = 3.50
  size?: "sm" | "md" | "lg";
}

function getGpaColor(gpa: number): string {
  if (gpa >= 370) return "text-green-600 dark:text-green-400";
  if (gpa >= 300) return "text-blue-600 dark:text-blue-400";
  if (gpa >= 200) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getGpaLabel(gpa: number): string {
  if (gpa >= 370) return "Excellent";
  if (gpa >= 300) return "Good";
  if (gpa >= 200) return "Satisfactory";
  if (gpa > 0) return "Needs Improvement";
  return "N/A";
}

export default function GpaDisplay({ gpa, size = "md" }: GpaDisplayProps) {
  const display = gpa > 0 ? (gpa / 100).toFixed(2) : "—";
  const color = getGpaColor(gpa);
  const label = getGpaLabel(gpa);

  const sizeClasses = {
    sm: "text-lg",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div className="text-center">
      <div className={`font-bold ${sizeClasses[size]} ${color}`}>
        {display}
      </div>
      <div className="text-xs text-zinc-400">{label}</div>
    </div>
  );
}
