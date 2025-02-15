"use client";

import { useState, useEffect, useMemo } from "react";
//import RefreshReadAcessToken from "../api/refreshToken";
import { useStore } from "./store/store";
import Footer from "./components/Footer";
import dynamic from "next/dynamic";
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
  const { activities, isLoading, error, fetchActivities } = useStore();

  useEffect(() => {
    fetchActivities();
    //fetchTotalDistance();
  }, [fetchActivities]);

  const Map = useMemo(
    () =>
      dynamic(() => import("./components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    console.log("ACTIVITIES", activities);
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {activities.length > 0 ? (
        <div className="w-full row-start-2 flex gap-6 flex-wrap items-center justify-center">
          {activities.map((activity) => {
            <Card>
              <CardHeader>
                <CardTitle>Create project</CardTitle>
                <CardDescription>
                  Deploy your new project in one-click.
                </CardDescription>
              </CardHeader>
              <CardContent>{activity.name}</CardContent>
              <CardFooter className="flex justify-between">Footer</CardFooter>
            </Card>;
          })}
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
