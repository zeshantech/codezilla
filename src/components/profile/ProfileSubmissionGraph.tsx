"use client";

import { ActivityRecord } from "@/types/profile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useMemo } from "react";

interface ProfileSubmissionGraphProps {
  activityHistory: ActivityRecord[];
}

export function ProfileSubmissionGraph({
  activityHistory,
}: ProfileSubmissionGraphProps) {
  // Process activity data for the chart
  const submissionData = useMemo(() => {
    // Group activity records by week
    const groupedByWeek: Record<string, { solved: number; attempted: number }> =
      {};

    activityHistory.forEach((record) => {
      const date = new Date(record.date);
      const weekLabel = getWeekLabel(date);

      if (!groupedByWeek[weekLabel]) {
        groupedByWeek[weekLabel] = { solved: 0, attempted: 0 };
      }

      groupedByWeek[weekLabel].solved += record.problemsSolved;
      groupedByWeek[weekLabel].attempted +=
        record.submissions - record.problemsSolved;
    });

    // Convert to array format for chart
    return Object.entries(groupedByWeek).map(([week, data]) => ({
      week,
      solved: data.solved,
      attempted: data.attempted,
    }));
  }, [activityHistory]);

  // Utility to get week label in format "Mar 1-7"
  function getWeekLabel(date: Date): string {
    const weekStart = new Date(date);
    const dayOfWeek = date.getDay();
    weekStart.setDate(date.getDate() - dayOfWeek); // Start of week (Sunday)

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
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
      <CardContent className="h-80">
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
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <ChartTooltip
              content={({ active, payload }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  labelFormatter={(label) => (
                    <div className="font-medium">Week of {label}</div>
                  )}
                />
              )}
            />
            <ChartLegend
              content={({ payload }) => (
                <ChartLegendContent payload={payload} />
              )}
            />
            <Bar
              dataKey="solved"
              fill="var(--color-solved)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="attempted"
              fill="var(--color-attempted)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
