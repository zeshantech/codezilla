"use client";

import { useState } from "react";
import { IPerformanceDistribution } from "@/types/submissions";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Clock, Cpu } from "lucide-react";

interface PerformanceChartProps {
  runtimeMs: number;
  memoryMB: number;
  runtimePercentile?: number;
  memoryPercentile?: number;
  runtimeDistribution?: IPerformanceDistribution[];
  memoryDistribution?: IPerformanceDistribution[];
}

export function PerformanceChart({ runtimeMs, memoryMB, runtimePercentile = 0, memoryPercentile = 0, runtimeDistribution = [], memoryDistribution = [] }: PerformanceChartProps) {
  const [activeTab, setActiveTab] = useState<string>("runtime");

  // Find the index where the current runtime/memory value belongs
  const findCurrentBarIndex = (distribution: IPerformanceDistribution[], currentValue: number) => {
    return distribution.findIndex((item, index, arr) => {
      const nextItem = arr[index + 1];
      return currentValue >= item.value && (!nextItem || currentValue < nextItem.value);
    });
  };

  const runtimeCurrentIndex = findCurrentBarIndex(runtimeDistribution, runtimeMs);
  const memoryCurrentIndex = findCurrentBarIndex(memoryDistribution, memoryMB);

  // Generate chart data with isCurrentValue flag
  const runtimeChartData = runtimeDistribution.map((item, index) => ({
    ...item,
    isCurrentValue: index === runtimeCurrentIndex,
    name: `${item.value} ms`,
  }));

  const memoryChartData = memoryDistribution.map((item, index) => ({
    ...item,
    isCurrentValue: index === memoryCurrentIndex,
    name: `${item.value} MB`,
  }));

  // Format chart config

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const unit = activeTab === "runtime" ? "MS" : "MB";

    return (
      <div className="bg-background border rounded-md p-2 text-xs">
        <p className="font-medium">{`${data.value} ${unit}: ${data.count} submissions`}</p>
      </div>
    );
  };

  const CustomBar = (props: any) => {
    const { x, y, width, height, payload } = props;
    const isCurrentValue = payload.isCurrentValue;

    return <rect x={x} y={y} width={width} height={height} className={cn(isCurrentValue ? "fill-primary" : "fill-muted-foreground/20", "rounded-t-sm")} />;
  };

  return (
    <div className="border-none shadow-none p-0 ">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="runtime">Runtime</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="p-4">
        {activeTab === "runtime" ? (
          <div className="space-y-4">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground flex items-center gap-2 font-semibold">
                <Clock className="size-5" />
                Runtime
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {runtimeMs} <span className="text-muted-foreground text-base font-semibold">MS</span>
                </p>
                <Separator orientation="vertical" className="h-12 w-1" />
                <p className="text-2xl font-bold">
                  <span className="text-muted-foreground text-base font-semibold">Beats</span> {runtimePercentile}%<span>👏</span>
                </p>
              </div>
            </div>

            <div className="h-56 w-full pt-6">
              {runtimeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={runtimeChartData} barGap={1} barSize={100}>
                    <XAxis dataKey="value" tick={{ fontSize: 9 }} tickFormatter={(value, index) => (index % 5 === 0 ? `${value} ms` : "")} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" shape={<CustomBar />} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-fulh-full flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No runtime data available</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground flex items-center gap-2 font-semibold">
                <Cpu className="size-5" />
                Memory
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {memoryMB} <span className="text-muted-foreground text-base font-semibold">MB</span>
                </p>
                <Separator orientation="vertical" className="h-12 w-1" />
                <p className="text-2xl font-bold">
                  <span className="text-muted-foreground text-base font-semibold">Beats</span> {memoryPercentile}%<span>👏</span>
                </p>
              </div>
            </div>

            <div className="h-56 w-full pt-6">
              {memoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={memoryChartData} barGap={1} barSize={100}>
                    <XAxis dataKey="value" tick={{ fontSize: 9 }} tickFormatter={(value, index) => (index % 5 === 0 ? `${value} MB` : "")} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" shape={<CustomBar />} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No memory data available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
