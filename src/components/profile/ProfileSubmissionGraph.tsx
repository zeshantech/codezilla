"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useMemo } from "react";
import { useUserProfileStore } from "@/store/useUserProfileStore";

export function ProfileSubmissionGraph({ isOverview = false }: { isOverview?: boolean }) {
  const activityHistory = useUserProfileStore((state) => state.activityStats)?.slice(0, isOverview ? 4 : undefined) || [];

  const submissionData = useMemo(() => {
    const groupedByWeek: Record<string, { solved: number; attempted: number }> = {};

    activityHistory.forEach((record) => {
      const date = new Date(record.from);
      const weekLabel = getWeekLabel(date);

      if (!groupedByWeek[weekLabel]) {
        groupedByWeek[weekLabel] = { solved: 0, attempted: 0 };
      }

      groupedByWeek[weekLabel].solved += record.problemsSolved;
      groupedByWeek[weekLabel].attempted += record.submissions - record.problemsSolved;
    });

    return Object.entries(groupedByWeek).map(([week, data]) => ({
      week,
      solved: data.solved,
      attempted: data.attempted,
    }));
  }, [activityHistory]);

  function getWeekLabel(date: Date): string {
    const weekStart = new Date(date);
    const dayOfWeek = date.getDay();
    weekStart.setDate(date.getDate() - dayOfWeek);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const startMonth = monthNames[weekStart.getMonth()];
    const endMonth = monthNames[weekEnd.getMonth()];

    if (startMonth === endMonth) {
      return `${startMonth} ${weekStart.getDate()}-${weekEnd.getDate()}`;
    } else {
      return `${startMonth} ${weekStart.getDate()}-${endMonth} ${weekEnd.getDate()}`;
    }
  }

  return (
    <Card className="col-span-1 overflow-hidden">
      <CardHeader>
        <CardTitle>Submission Activity</CardTitle>
        <CardDescription>Your problem-solving activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            solved: {
              label: "Solved",
              theme: {
                light: "#4f46e5",
                dark: "#818cf8",
              },
            },
            attempted: {
              label: "Attempted",
              theme: {
                light: "#f97316",
                dark: "#fb923c",
              },
            },
          }}
        >
          <BarChart data={submissionData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <ChartTooltip content={({ active, payload }) => <ChartTooltipContent active={active} payload={payload} labelFormatter={(label) => <div className="font-medium">Week of {label}</div>} />} />
            <ChartLegend content={({ payload }) => <ChartLegendContent payload={payload} />} />
            <Bar dataKey="solved" fill="var(--color-solved)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="attempted" fill="var(--color-attempted)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
