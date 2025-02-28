"use client";

import React, { useEffect } from "react";
import { useStore } from "../store/store";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function Page() {
  //get distance
  const {
    activities,
    isLoading,
    error,
    fetchChartData,
    totalDistance,
    chartData,
  } = useStore();

  //   useEffect(() => {
  //     fetchTotalDistance(activities);
  //   }, [fetchTotalDistance, activities]);

  //use the recharts here
  //https://ui.shadcn.com/docs/components/chart

  // useEffect(() => {
  //   console.log("DISTANCE", totalDistance);
  // });

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  const chartData2 = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  useEffect(() => {
    console.log("in useEffect", activities);
    fetchChartData(activities);

    console.log(chartData);
  }, [fetchChartData, activities]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {chartData.length > 0 ? (
        <div className="flex justify-center items-center">
          <ChartContainer
            config={chartConfig}
            className="max-h-[700px] max-w-[1800px] min-h-[700px] min-w-[1800px]"
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="title"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="distance" fill="var(--color-desktop)" radius={4} />
              {/* <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
            </BarChart>
          </ChartContainer>
        </div>
      ) : (
        <div className="w-full row-start-2 flex gap-6 flex-wrap items-center justify-center">
          <p>Loooooading...</p>
        </div>
      )}
    </div>
  );
}
