//http://localhost:1234/v1/models
//http://localhost:1234/v1/chat/completions

//this calls the api route

import axios from "axios";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const getCompletion = async (MessageParams: ChatMessage[]) => {
  console.log(MessageParams);
  try {
    const response = await axios.post("/api/lmstudio", {
      model: "phi-3.1-mini-128k-instruct",
      messages: MessageParams,
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
