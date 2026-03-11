"use client";

interface DegreeProgress {
  programName: string;
  collegeName: string;
  percentComplete: number;
  completedRequirements: number;
  totalRequirements: number;
}

interface DegreeProgressBarsProps {
  data: DegreeProgress[];
}

function progressColor(percent: number): string {
  if (percent >= 80) return "bg-green-500";
  if (percent >= 50) return "bg-blue-500";
  if (percent >= 25) return "bg-amber-500";
  return "bg-zinc-400";
}

export function DegreeProgressBars({ data }: DegreeProgressBarsProps) {
  if (data.length === 0) {
    return (
      <div className="text-sm text-zinc-400">No degree progress data</div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((d) => (
        <div key={d.programName}>
          <div className="mb-1 flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                {d.programName}
              </span>
              <span className="ml-2 text-xs text-zinc-400">{d.collegeName}</span>
            </div>
            <span className="text-sm font-mono text-zinc-500">
              {d.completedRequirements}/{d.totalRequirements}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className={`h-3 rounded-full transition-all ${progressColor(d.percentComplete)}`}
              style={{ width: `${d.percentComplete}%` }}
            />
          </div>
          <div className="mt-0.5 text-right text-xs text-zinc-400">{d.percentComplete}%</div>
        </div>
      ))}
    </div>
  );
}
