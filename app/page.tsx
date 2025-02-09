"use client";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
//import RefreshReadAcessToken from "../api/refreshToken";
import Footer from "./components/Footer";
import dynamic from "next/dynamic";
import { getAllActivities } from "./actions/getActivities";

export default function Home() {
  //const [accessToken, setAccessToken] = useState(null);

  const [activities, SetActivities] = useState([]); //<Activity[]>([]);

  useEffect(() => {
    const getActivities = async () => {
      try {
        const thisActivities = await getAllActivities("banama");
        SetActivities(thisActivities);
      } catch (error) {
        console.error("Error refreshing the access token:", error);
        throw new Error("Unable to refresh access token");
      }
    };

    getActivities();
  }, []);

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

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <button onClick={getAllActivities}>Get Activities</button> */}
      {/* <button onClick={refreshAccessToken}>Refresh</button> */}
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
