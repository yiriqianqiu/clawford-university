"use client";

import dynamic from "next/dynamic";

const KarmaChart = dynamic(
  () => import("@/components/dashboard/KarmaChart").then((m) => m.KarmaChart),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />,
  },
);

const SkillRadar = dynamic(
  () => import("@/components/dashboard/SkillRadar").then((m) => m.SkillRadar),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />,
  },
);

const GpaTrendChart = dynamic(
  () => import("@/components/dashboard/GpaTrendChart").then((m) => m.GpaTrendChart),
  {
    ssr: false,
    loading: () => <div className="h-60 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />,
  },
);

const CreditsProgressRing = dynamic(
  () => import("@/components/dashboard/CreditsProgressRing").then((m) => m.CreditsProgressRing),
  {
    ssr: false,
    loading: () => <div className="h-40 w-40 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800" />,
  },
);

const DegreeProgressBars = dynamic(
  () => import("@/components/dashboard/DegreeProgressBars").then((m) => m.DegreeProgressBars),
  {
    ssr: false,
    loading: () => <div className="h-32 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />,
  },
);

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface RadarData {
  category: string;
  value: number;
  fullMark: number;
}

interface GpaSemester {
  semester: string;
  gpa: number;
}

interface DegreeProgress {
  programName: string;
  collegeName: string;
  percentComplete: number;
  completedRequirements: number;
  totalRequirements: number;
}

export function KarmaChartWrapper({ data, total }: { data: ChartData[]; total: number }) {
  return <KarmaChart data={data} total={total} />;
}

export function SkillRadarWrapper({ data }: { data: RadarData[] }) {
  return <SkillRadar data={data} />;
}

export function GpaTrendWrapper({ data, cumulativeGpa }: { data: GpaSemester[]; cumulativeGpa: number }) {
  return <GpaTrendChart data={data} cumulativeGpa={cumulativeGpa} />;
}

export function CreditsProgressWrapper({ earned, required, label }: { earned: number; required: number; label?: string }) {
  return <CreditsProgressRing earned={earned} required={required} label={label} />;
}

export function DegreeProgressWrapper({ data }: { data: DegreeProgress[] }) {
  return <DegreeProgressBars data={data} />;
}
