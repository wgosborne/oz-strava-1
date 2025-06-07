import axios from "axios";
import { refreshAccessToken } from "./refreshToken";

export const getAllActivities = async () => {
  try {
    const access_token = await refreshAccessToken();

    const response = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        params: {
          access_token: access_token,
          after: 1749254400, //after june 7th
          per_page: 20,
        },
      }
    );

    const activities = response.data;
    const activitiesWithNotes = [];

    //getting description
    for (const activity of activities) {
      try {
        const detailedActivityResponse = await axios.get(
          `https://www.strava.com/api/v3/activities/${activity.id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        const detailedActivity = detailedActivityResponse.data;
        activitiesWithNotes.push({
          ...activity, // Include existing activity data
          description: detailedActivity.description || "", // Add the notes
        });
      } catch (err) {
        console.error(
          `Error getting detailed activity for ${activity.id}:`,
          err
        );

        activitiesWithNotes.push(activity);
      }
    }

    return activitiesWithNotes;
  } catch (err) {
    console.error("Error getting all activities:", err);
  }
};
