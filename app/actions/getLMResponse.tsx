//http://localhost:1234/v1/models
//http://localhost:1234/v1/chat/completions

import axios from "axios";

export const getCompletion = async () => {
  try {
    const response = await axios.post("/api/lmstudio", {
      model: "phi-3.1-mini-128k-instruct",
      messages: [
        {
          role: "user",
          content: "Write a short poem about a rainy day in 5 words",
        },
      ],
    });


    if (!response.data.choices) {
      return [];
    } else {
      return response.data;
    }
  } catch (err) {
    console.error("Error getting completions:", err);
  }
};
