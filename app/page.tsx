"use client";

import axios from "axios";
import Footer from "./Footer";

export default function Home() {
  {
    /* const rooms = await prisma.room.findMany({
    orderBy: { roomNum: 'asc' }
  });

  const patients = await prisma.patient.findMany({
    orderBy: { id: 'asc' }
  }); */
  }

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
    } catch (err) {
      console.error("Error refreshing access token:", err);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={getAllActivities}>Get Activities</button>
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
