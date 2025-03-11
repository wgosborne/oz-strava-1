import axios from "axios";

export const getAllQuotes = async () => {
  try {
    const baseUrl = "https://officeapi.akashrajpurohit.com";

    const response = await axios.get(baseUrl + "/quote/random", {
      params: {
        //access_token: access_token,
      },
    });

    //SetActivities(response.data);

    console.log(response);
    //returns activities
    return response.data;
  } catch (err) {
    console.error("Error getting all activities:", err);
  }
};
