"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface GpaSemester {
  semester: string;
  gpa: number;
}

interface GpaTrendChartProps {
  data: GpaSemester[];
  cumulativeGpa: number;
}

export function GpaTrendChart({ data, cumulativeGpa }: GpaTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-zinc-400">
        No semester data yet
      </div>
    );
  }

  const displayData = data.map((d) => ({
    ...d,
    gpa: Number((d.gpa / 100).toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={displayData} margin={{ top: 4, right: 0, bottom: 0, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.3} />
        <XAxis
          dataKey="semester"
          tick={{ fontSize: 11, fill: "#a1a1aa" }}
          axisLine={{ stroke: "#3f3f46" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 4]}
          ticks={[0, 1, 2, 3, 4]}
          tick={{ fontSize: 11, fill: "#a1a1aa" }}
          axisLine={{ stroke: "#3f3f46" }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
            color: "#f4f4f5",
            fontSize: 13,
          }}
          formatter={(value) => [Number(value).toFixed(2), "GPA"]}
        />
        <ReferenceLine
          y={Number((cumulativeGpa / 100).toFixed(2))}
          stroke="#eab308"
          strokeDasharray="5 5"
          label={{ value: "Cumulative", fill: "#eab308", fontSize: 11 }}
        />
        <Bar dataKey="gpa" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
