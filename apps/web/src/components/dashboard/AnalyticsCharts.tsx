"use client";

import dynamic from "next/dynamic";

const PopularCoursesChart = dynamic(
  () => import("@/components/dashboard/PopularCoursesChart").then((m) => m.PopularCoursesChart),
  { ssr: false, loading: () => <div className="h-72 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" /> },
);

const CollegePieChart = dynamic(
  () => import("@/components/dashboard/CollegePieChart").then((m) => m.CollegePieChart),
  { ssr: false, loading: () => <div className="h-72 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" /> },
);

const GpaDistributionChart = dynamic(
  () => import("@/components/dashboard/GpaDistributionChart").then((m) => m.GpaDistributionChart),
  { ssr: false, loading: () => <div className="h-60 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" /> },
);

interface PopularCourse {
  courseCode: string;
  courseTitle: string;
  enrollmentCount: number;
}

interface CollegeData {
  collegeName: string;
  studentCount: number;
}

interface GpaBucket {
  range: string;
  count: number;
}

export function PopularCoursesWrapper({ data }: { data: PopularCourse[] }) {
  return <PopularCoursesChart data={data} />;
}

export function CollegePieWrapper({ data }: { data: CollegeData[] }) {
  return <CollegePieChart data={data} />;
}

export function GpaDistributionWrapper({ data }: { data: GpaBucket[] }) {
  return <GpaDistributionChart data={data} />;
}
