"use client";

import { SkillStat } from "@/types/profile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useMemo } from "react";
import { ChevronRight, BarChart2 } from "lucide-react";

interface ProfileSkillsProps {
  skillStats: SkillStat[];
}

export function ProfileSkills({ skillStats }: ProfileSkillsProps) {
  // Convert skills data to format needed for radar chart
  const formattedSkillsData = useMemo(() => {
    return skillStats.map((skill) => ({
      subject: skill.categoryName,
      A: skill.percentage,
      fullMark: 100,
      solved: skill.problemsSolved,
      total: skill.totalProblems,
    }));
  }, [skillStats]);

  const isOverview = skillStats.length <= 5;

  // Display skill cards for detailed view
  if (!isOverview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Your Skills</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formattedSkillsData.map((skill) => (
            <Card key={skill.subject} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{skill.subject}</CardTitle>
                <CardDescription>
                  {skill.solved} solved out of {skill.total}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${skill.A}%` }}
                      />
                    </div>
                  </div>
                  <Badge className="ml-2">{skill.A}%</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Display radar chart for overview
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Skills Overview</CardTitle>
        <CardDescription>
          Based on your solved problems by category
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer
          config={{
            A: {
              label: "Skill Level",
              theme: {
                light: "#4f46e5",
                dark: "#818cf8",
              },
            },
          }}
        >
          <RadarChart data={formattedSkillsData} outerRadius={90}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis axisLine={false} tick={false} />
            <ChartTooltip
              content={({ active, payload }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  formatter={(value, name, entry) => (
                    <div className="flex flex-col">
                      <span>{value}% mastery</span>
                      <span className="text-xs text-muted-foreground">
                        {entry.payload.solved} / {entry.payload.total} problems
                      </span>
                    </div>
                  )}
                />
              )}
            />
            <Radar
              name="Skill"
              dataKey="A"
              stroke="var(--color-A)"
              fill="var(--color-A)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          href="/profile?tab=skills"
        >
          View all skills <ChevronRight />
        </Button>
      </CardFooter>
    </Card>
  );
}
