"use client";

import React, { useEffect, useMemo } from "react";
import { useStore } from "../store/store";
import dynamic from "next/dynamic";
import Footer from "../components/Footer";

export default function Page() {
  // Access the state and actions from the store
  const { activities } = useStore();

  const Map = useMemo(
    () =>
      dynamic(() => import("../components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    console.log("ACTIVITIES", activities);
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {activities.length > 0 ? (
        <div className="w-full row-start-2 flex gap-6 flex-wrap items-center justify-center">
          <Map
            zoom={13} // Default zoom level
            activities={activities}
          />
        </div>
      ) : (
        <p>Loading activities...</p>
      )}
      <Footer />
    </div>
  );
}
