import axios from "axios";
import { refreshAccessToken } from "./refreshToken";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGear = async (gearIds: any[]) => {
  const gearArray = [];

  try {
    const access_token = await refreshAccessToken();

    //each gear
    for (const id of gearIds) {
      try {
        const gearInfo = await axios.get(
          `https://www.strava.com/api/v3/gear/${id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        gearArray.push(gearInfo.data);
      } catch (err) {
        console.error(
          `Error getting detailed activity for gear. ID: ${id}:`,
          err
        );
      }
    }
    return gearArray;
  } catch (err) {
    console.error("Error getting detailed activity for gear: ", err);
  }
};
