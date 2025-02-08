"use client";
import axios from "axios";
import { useState, useEffect } from "react";
//import RefreshReadAcessToken from "../api/refreshToken";
import Footer from "./components/Footer";

export default function Home() {
  //const [accessToken, setAccessToken] = useState(null);

  const [activities, SetActivities] = useState(null);

  const getAllActivities = async () => {
    try {
      const response = await axios.get(
        "https://www.strava.com/api/v3/athlete/activities",
        {
          params: {
            access_token: "edeb47993eeff2d9c808c1971cac82da4d0b38d3",
          },
        }
      );
      console.log(response.data);

      SetActivities(response.data);
      console.log("ACTIVITIES", activities);
    } catch (err) {
      console.error("Error refreshing access token:", err);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post("/api/refreshToken", {
        refreshToken: "9fe778c7041af7cc6d2c640b4658a5e8b631dbff",
      });
      console.log(response.data.access_token);
    } catch (error) {
      console.error("Error refreshing the access token:", error);
      throw new Error("Unable to refresh access token");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={getAllActivities}>Get Activities</button>
      <button onClick={refreshAccessToken}>Refresh</button>
      <Footer />
    </div>
  );
}

// function getActivities() {
//   const activities_link =
//     "https://www.strava.com/api/v3/athlete/activities?access_token=edeb47993eeff2d9c808c1971cac82da4d0b38d3";

//   fetch(activities_link).then((res) => {
//     console.log(res);
//   });
// }

//post
//https://www.strava.com/oauth/token?client_id=147249&client_secret=a47591e64c23e07f2969edfef02031ec635b539d&refresh_token=9fe778c7041af7cc6d2c640b4658a5e8b631dbff&grant_type=refresh_token
