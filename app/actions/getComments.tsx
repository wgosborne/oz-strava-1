import axios from "axios";
import { refreshAccessToken } from "./refreshToken";

export const getAllComments = async () => {
  try {
    const access_token = await refreshAccessToken();

    const response = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        params: {
          access_token: access_token,
        },
      }
    );

    //SetActivities(response.data);

    console.log(response);
    //returns activities
    return response.data;
  } catch (err) {
    console.error("Error getting all activities:", err);
  }
};
