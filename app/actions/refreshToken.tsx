import axios from "axios";

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post("../api/refreshToken");

    const refresh_token = response.data.access_token;

    return refresh_token;
  } catch (error) {
    console.error("Error refreshing the access token:", error);
    throw new Error("Unable to refresh access token");
  }
};
