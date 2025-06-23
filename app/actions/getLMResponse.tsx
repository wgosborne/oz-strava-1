//http://localhost:1234/v1/models
//http://localhost:1234/v1/chat/completions

//this calls the api route

import axios from "axios";

export const getCompletion = async (activities: any[]) => {
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  let filteredActivities = [];

  //getting activities for just past month
  filteredActivities = activities
    .filter((activity) => {
      const activityDate = new Date(activity.start_date);
      return activityDate >= oneMonthAgo && activityDate <= now;
    })
    .map(
      ({
        id,
        name,
        distance,
        moving_time,
        average_speed,
        max_speed,
        total_elevation_gain,
        start_date,
      }) => ({
        id,
        name,
        distance: (distance / 1609.34).toFixed(2),
        moving_time,
        average_speed:
          Math.floor(distance / average_speed / 60 / distance / 1609.34) +
          ":" +
          String(
            Math.floor(
              ((distance / average_speed / 60 / (distance / 1609.34)) % 1) * 60
            )
          ).padStart(2, "0"),
        max_speed,
        total_elevation_gain,
        start_date,
      })
    );

  try {
    const response = await axios.post("/api/lmstudio", {
      model: "phi-3.1-mini-128k-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are a professional running coach. Speak in an encouraging and knowledgeable tone, provide structured training plans, pace advice, and your primary concern is injury prevention",
        },
        {
          role: "user",
          content: `Here is data about my runs for the past month ${filteredActivities} give me about a paragraph with insights into how my training is looking and include bullet points at the bottom of my average distance and pace.`,
        },
      ],
    });

    if (!response.data?.choices) {
      console.warn("No choices returned from LM Studio.");
      return [];
    }

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.response) {
      // Received a response from server with an error code
      //console.error("LM Studio returned an error:", err.response.data);
      return {
        error:
          err.response.data?.error || "LM Studio returned an error response.",
        details: err.response.data?.details,
      };
    } else if (err.request) {
      // Request was made but no response received
      //console.error("No response from LM Studio:", err.message);
      return {
        error: "No response from LM Studio. Is it running?",
        details: err.message,
      };
    } else {
      // Something else went wrong
      console.error("Unexpected error:", err.message);
      return {
        error: "Unexpected error",
        details: err.message,
      };
    }
  }
};
