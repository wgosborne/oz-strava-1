"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Activity } from "@/app/types/Activity";

interface ActivityListProps {
  activities: Activity[];
}

export default function ActivityList({ activities }: ActivityListProps) {
  const [excludeRuns, setExcludeRuns] = useState(false);

  const filteredActivities = excludeRuns
    ? activities.filter(
        (activity) => activity.description && activity.description.trim() !== ""
      )
    : activities;

  return (
    <>
      <div className="flex items-center space-x-4 mb-6">
        <Label htmlFor="exclude-runs">Description Runs Only</Label>
        <Switch
          id="exclude-runs"
          checked={excludeRuns}
          onCheckedChange={setExcludeRuns}
        />
        <Label>Run Count: {filteredActivities.length}</Label>
      </div>

      <div className="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredActivities.map((activity) => (
          <Card
            key={activity.id}
            className="h-[310px] w-full flex flex-col justify-between"
          >
            <CardHeader className="overflow-hidden">
              <CardTitle className="text-wrap break-words text-base">
                {activity.name}
              </CardTitle>
              <CardDescription className="text-wrap break-words text-sm line-clamp-6">
                {activity.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              Distance in Miles:{" "}
              {(activity.distance / 1609.34).toFixed(2)}
              <br />
              Average Pace:{" "}
              {formatPace(activity.distance, activity.average_speed)}
            </CardContent>
            <CardFooter className="flex justify-between text-sm">
              Kudos: {activity.kudos_count}
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

function formatPace(distance: number, averageSpeed: number): string {
  const paceMinutes = distance / averageSpeed / 60 / (distance / 1609.34);
  const minutes = Math.floor(paceMinutes);
  const seconds = Math.floor((paceMinutes % 1) * 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
