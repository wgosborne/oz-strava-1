"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Activity } from "@/app/types/Activity";

interface MapWrapperProps {
  activities: Activity[];
}

export default function MapWrapper({ activities }: MapWrapperProps) {
  const Map = useMemo(
    () =>
      dynamic(() => import("../components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return <Map zoom={13} activities={activities} />;
}
