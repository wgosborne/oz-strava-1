/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
//import RefreshReadAcessToken from "../api/refreshToken";
import { useStore } from "./store/store";
import Footer from "./components/Footer";
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

export default function Home() {
  // Access the state and actions from the store
  const activities = useStore((state) => state.activities);
  const error = useStore((state) => state.error);
  const isLoading = useStore((state) => state.isLoading);
  const fetchActivities = useStore((state) => state.fetchActivities);
  const syncActivities = useStore((state) => state.syncActivities);
  ////// UNCOMMENT THIS BELOW TO SYNC UP THE DATABASE
  // const fetchActivitiesFromStrava = useStore(
  //   (state) => state.fetchActivitiesFromStrava
  // );
  const excludeRuns = useStore((state) => state.excludeRuns);
  const setExcludeRuns = useStore((state) => state.setExcludeRuns);
  const expandedCards = useStore((state) => state.excludeRuns);
  const setExpandedCards = useStore((state) => state.setExcludeRuns);
  let filteredActivities: any[] = [];

  useEffect(() => {
    fetchActivities();
    ////// UNCOMMENT THIS BELOW TO SYNC UP THE DATABASE
    //fetchActivitiesFromStrava();
  }, [fetchActivities]);

  useEffect(() => {
    console.log("ACTIVITIES", activities);
    ////// UNCOMMENT THIS BELOW TO SYNC UP THE DATABASE
    //syncActivities(activities);
  }, [activities, syncActivities]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (activities.length === 0) {
    return <div>Loading now...</div>; // Prevent rendering before data is available
  }

  filteredActivities = excludeRuns
    ? activities.filter(
        // (act: { name: string }) =>
        //   ![
        //     "Morning Run",
        //     "Afternoon Run",
        //     "Evening Run",
        //     "Lunch Run",
        //   ].includes(act.name)
        (activity: any) =>
          activity.description && activity.description.trim() !== ""
      )
    : activities;

  return (
    <div className="p-4">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex items-center space-x-4">
          <Label htmlFor="exclude-runs">Description Runs Only</Label>
          <Switch
            id="exclude-runs"
            checked={excludeRuns}
            onCheckedChange={setExcludeRuns}
          />
          <Label>Run Count:&nbsp;{filteredActivities.length}</Label>
        </div>
        {activities.length > 0 ? (
          // <div className="w-full row-start-2 flex gap-6 flex-wrap items-center justify-center">
          <div className="w-full row-start-2 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredActivities.map((activity: any) => (
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
                  Distance in Miles:&nbsp;
                  {(activity.distance / 1609.34).toFixed(2)}
                  <br />
                  Average Pace:&nbsp;
                  {Math.floor(
                    activity.distance /
                      activity.average_speed /
                      60 /
                      (activity.distance / 1609.34)
                  ) +
                    ":" +
                    String(
                      Math.floor(
                        ((activity.distance /
                          activity.average_speed /
                          60 /
                          (activity.distance / 1609.34)) %
                          1) *
                          60
                      )
                    ).padStart(2, "0")}
                </CardContent>
                <CardFooter className="flex justify-between text-sm">
                  Kudos:&nbsp;{activity.kudos_count}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="w-full row-start-2 flex gap-6 flex-wrap items-center justify-center">
            <p>Loading...</p>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}
