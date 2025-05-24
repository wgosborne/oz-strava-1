import axios from "axios";

export const getAllQuotes = async () => {
  try {
    const baseUrl = "https://officeapi.akashrajpurohit.com";

    const response = await axios.get(baseUrl + "/quote/random", {
      params: {
        //access_token: access_token,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Error getting all activities:", err);
  }
};
