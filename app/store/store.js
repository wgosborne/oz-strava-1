// store.js (or zustandStore.js)
import { create } from "zustand";
import { getAllActivities } from "../actions/getActivities";
import { getAllComments } from "../actions/getComments";
import { getAllQuotes } from "../actions/getAllComments";
import { getAllTweets } from "../actions/getAllTweets";

// Define the store
export const useStore = create((set) => ({
  theme: localStorage.getItem("theme") || "light", // Load from localStorage
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme); // Save to localStorage
      return { theme: newTheme };
    });
  },

  accessToken: null, // will hold the access token
  activities: [], // will hold the activities
  isLoading: false, // loading state
  error: null, // to track any errors
  totalDistance: 0,
  chartData: [],
  comments: [],
  quotes: [],
  tweets: [],

  // Action to set the access token
  //setAccessToken: (token) => set({ accessToken: token }),

  // Action to fetch activities
  fetchActivities: async (refreshToken) => {
    set({ isLoading: true, error: null }); // Start loading and clear any previous errors
    try {
      // Wait for the refreshed access token
      //   const token = await refreshToken();

      //   // Set the access token in the store
      //   set({ accessToken: token });

      // Fetch activities using the token
      const newActivities = await getAllActivities();

      // Set the activities data
      set({ activities: newActivities });

      var thisTotalDistance = 0;

      newActivities.map((act) => {
        thisTotalDistance += act.distance;
      });
      set({
        totalDistance: thisTotalDistance.toFixed(2),
        isLoading: false,
      });
    } catch (err) {
      // Handle any errors
      set({ isLoading: false, error: err.message });
    }
  },

  fetchComments: async (refreshToken) => {
    set({ isLoading: true, error: null }); // Start loading and clear any previous errors
    try {
      // Wait for the refreshed access token
      //   const token = await refreshToken();

      //   // Set the access token in the store
      //   set({ accessToken: token });

      // Fetch activities using the token
      const newComments = await getAllComments();

      // Set the activities data
      set({ comments: newComments });

      set({
        isLoading: false,
      });
    } catch (err) {
      // Handle any errors
      set({ isLoading: false, error: err.message });
    }
  },

  fetchQuotes: async () => {
    set({ isLoading: true, error: null }); // Start loading and clear any previous errors
    try {
      const newQuotes = await getAllQuotes();

      // Set the activities data
      set({ quotes: newQuotes });

      set({
        isLoading: false,
      });
    } catch (err) {
      // Handle any errors
      set({ isLoading: false, error: err.message });
    }
  },

  fetchTweets: async () => {
    set({ isLoading: true, error: null }); // Start loading and clear any previous errors
    try {
      const newTweets = await getAllTweets();

      // Set the activities data
      set({ tweets: newTweets });

      set({
        isLoading: false,
      });
    } catch (err) {
      // Handle any errors
      set({ isLoading: false, error: err.message });
    }
  },

  // fetchTotalDistance: (activities) => {
  //   set({ isLoading: true, error: null }); // Start loading and clear any previous errors

  //   newActivities.map((act) => {
  //     totalDistance += act.distance;
  //   });
  //   set({ activities: newActivities, isLoading: false });
  // },
  fetchChartData: (activities) => {
    set({ isLoading: true, error: null }); // Start loading and clear any previous errors

    let newChartData = [];

    activities.map((activity) => {
      const currObj = {
        title: activity.name,
        distance: activity.distance * 0.000621371,
      };

      newChartData.push(currObj);

      set({ chartData: newChartData, isLoading: false });
    });
  },
}));
