"use client";

import { useEffect, useMemo } from "react";
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

export default function Home() {
  // Access the state and actions from the store
  const activities = useStore((state) => state.activities);
  const error = useStore((state) => state.error);
  const isLoading = useStore((state) => state.isLoading);
  const fetchActivities = useStore((state) => state.fetchActivities);
  // let coolActivities = [];

  useEffect(() => {
    fetchActivities();
    // coolActivities = activities.filter((act) => {
    //   if (
    //     act.name != "Morning Run" &&
    //     act.name != "Afternoon Run" &&
    //     act.name != "Evening Run"
    //   ) {
    //     return act;
    //   }
    // });
    //fetchTotalDistance();
  }, [fetchActivities]);

  useEffect(() => {
    console.log("ACTIVITIES", activities);

    // console.log("COOL ONES", coolActivities);
  }, [activities]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (activities.length === 0) {
    return <div>Loading now...</div>; // Prevent rendering before data is available
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {activities.length > 0 ? (
        <div className="w-full row-start-2 flex gap-6 flex-wrap items-center justify-center">
          {activities
            .filter((act) => {
              if (
                act.name != "Morning Run" &&
                act.name != "Afternoon Run" &&
                act.name != "Evening Run"
              ) {
                return act;
              }
            })
            .map((activity) => (
              <Card key={activity.id}>
                <CardHeader>
                  <CardTitle>Create project</CardTitle>
                  <CardDescription>
                    Distance in Miles: {activity.distance / 1609.34}
                  </CardDescription>
                </CardHeader>
                <CardContent>{activity.name} <br /> {}</CardContent>
                <CardFooter className="flex justify-between">
                  Kudos: {activity.kudos_count}
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
  );
}
