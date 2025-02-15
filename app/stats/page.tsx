"use client";

import React, { useEffect } from "react";
import { useStore } from "../store/store";

export default function Page() {
  //get distance
  const { activities, isLoading, error, fetchActivities, totalDistance } =
    useStore();

//   useEffect(() => {
//     fetchTotalDistance(activities);
//   }, [fetchTotalDistance, activities]);


  useEffect(() => {
    console.log("DISTANCE", totalDistance);
  });

  return <div>STATS</div>;
}
