import axios from "axios";

export const getAllTweets = async () => {
  try {
    const baseUrl = "https://api.x.com/2/tweets/search/recent?";

    const response = await axios.get(baseUrl, {
      headers: {
        //Authorization: `Bearer ${process.env.BearerToken}`,
        Authorization: `Bearer AAAAAAAAAAAAAAAAAAAAAJ9XzwEAAAAAuOhxtzfyrGDYU9oReMSOJGPf5zg%3DrfyhGriYeYD4OBHdx41vkYy4ldTTByMSFobIW0GMysxLlKbSGd`,
      },
      params: {
        query: "Naperville",
        max_results: 10,
      },
    });


    return response.data;
  } catch (err) {
    console.error("Error getting all activities:", err);
  }
};
