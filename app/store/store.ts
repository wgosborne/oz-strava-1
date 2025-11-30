import { create } from "zustand";
import { getCompletion } from "../actions/getLMResponse";
import { Activity } from "../types/Activity";

// Types
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface StoreState {
  // UI State
  theme: "light" | "dark";
  excludeRuns: boolean;
  expandedCards: number[];

  // LM Studio Chat State
  isLoading: boolean;
  error: string | null;
  LMResponse: string;
  MessageParams: ChatMessage[];
}

interface StoreActions {
  // Theme actions
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;

  // UI actions
  setExcludeRuns: (value: boolean) => void;
  setExpandedCards: (value: number[]) => void;

  // Chat actions
  setMessageParams: (value: ChatMessage[]) => void;
  addMessage: (msg: ChatMessage) => void;
  fetchLMResponse: (
    activities: Activity[],
    newMessageParams?: ChatMessage | ""
  ) => Promise<void>;
}

type Store = StoreState & StoreActions;

export const useStore = create<Store>((set, get) => ({
  // UI State
  theme: "light",
  excludeRuns: false,
  expandedCards: [],

  // LM Studio Chat State
  isLoading: false,
  error: null,
  LMResponse: "",
  MessageParams: [],

  // Theme actions
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
      return { theme: newTheme };
    });
  },

  // UI actions
  setExcludeRuns: (value) => set({ excludeRuns: value }),
  setExpandedCards: (value) => set({ expandedCards: value }),

  // Chat actions
  setMessageParams: (value) => set({ MessageParams: value }),
  addMessage: (msg) =>
    set((state) => ({ MessageParams: [...state.MessageParams, msg] })),

  fetchLMResponse: async (activities, newMessageParams) => {
    set({ isLoading: true, error: null });

    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // Filter activities from the past month and format for LM
    const filteredActivities = activities
      .filter((activity) => {
        const activityDate = new Date(activity.start_date);
        return activityDate >= oneMonthAgo && activityDate <= now;
      })
      .map(({ id, name, distance, moving_time, average_speed, max_speed, total_elevation_gain, start_date }) => {
        const distanceMiles = distance / 1609.34;
        const paceMinutes = distance / average_speed / 60 / distanceMiles;
        const minutes = Math.floor(paceMinutes);
        const seconds = Math.floor((paceMinutes % 1) * 60);

        return {
          id,
          name,
          distance: distanceMiles.toFixed(2),
          moving_time,
          average_speed: `${minutes}:${String(seconds).padStart(2, "0")}`,
          max_speed,
          total_elevation_gain,
          start_date,
        };
      });

    // Initialize or update message params
    if (!newMessageParams || newMessageParams === "") {
      set({
        MessageParams: [
          {
            role: "system",
            content:
              "You are a professional running coach. Speak in an encouraging and knowledgeable tone, provide structured training plans, pace advice, and your primary concern is injury prevention",
          },
          {
            role: "user",
            content: `Here is data about my runs for the past month ${JSON.stringify(filteredActivities)} give me about a paragraph with insights into how my training is looking and include bullet points at the bottom of my average distance and pace.`,
          },
        ],
      });
    } else {
      get().addMessage(newMessageParams);
    }

    try {
      const MessageParams = get().MessageParams;
      const newRes = await getCompletion(MessageParams);

      // Check if getCompletion returned an error object
      if (newRes?.error) {
        set({
          isLoading: false,
          error: newRes.error,
          LMResponse: ""
        });
        return;
      }

      if (!newRes || !newRes.choices || newRes.choices.length === 0) {
        set({ LMResponse: "", isLoading: false });
      } else {
        set({
          LMResponse: newRes.choices[0].message.content,
          isLoading: false,
          error: null, // Clear any previous errors
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      set({ isLoading: false, error: errorMessage });
    }
  },
}));
