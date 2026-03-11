"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface CreditsProgressRingProps {
  earned: number;
  required: number;
  label?: string;
}

export function CreditsProgressRing({ earned, required, label }: CreditsProgressRingProps) {
  const remaining = Math.max(0, required - earned);
  const percent = required > 0 ? Math.min(100, Math.round((earned / required) * 100)) : 0;

  const data = [
    { name: "Earned", value: earned, fill: "#22c55e" },
    { name: "Remaining", value: remaining, fill: "#27272a" },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-40 w-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={65}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-zinc-900 dark:text-white">{percent}%</span>
          <span className="text-xs text-zinc-500">{earned}/{required}</span>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      )}
    </div>
  );
}
