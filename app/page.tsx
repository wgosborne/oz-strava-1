"use client";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
//import RefreshReadAcessToken from "../api/refreshToken";
import Footer from "./components/Footer";
import dynamic from "next/dynamic";

export default function Home() {
  //const [accessToken, setAccessToken] = useState(null);

  const [activities, SetActivities] = useState([]); //<Activity[]>([]);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await axios.post("/api/refreshToken");

        const refresh_token = response.data.access_token;
        getAllActivities(refresh_token);
      } catch (error) {
        console.error("Error refreshing the access token:", error);
        throw new Error("Unable to refresh access token");
      }
    };

    const getAllActivities = async (refresh_token: string) => {
      try {
        const response = await axios.get(
          "https://www.strava.com/api/v3/athlete/activities",
          {
            params: {
              access_token: refresh_token,
            },
          }
        );

        SetActivities(response.data);
      } catch (err) {
        console.error("Error refreshing access token:", err);
      }
    };

    refreshAccessToken();
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
        <div
          className="w-full flex justify-center items-center"
          style={{ height: "70vh" }}
        >
          {/* <Map
            lat={activities[0].start_latlng[0] || 51.505} // Use first activity's lat/lng
            lng={activities[0].start_latlng[1] || -0.09} // Use first activity's lng
            zoom={13} // Default zoom level
          /> */}
        </div>
      ) : (
        <p>Loading activities...</p>
      )}
      <Map lat={51.505} lng={-0.09} zoom={50} />
      <Footer />
    </div>
  );
}
