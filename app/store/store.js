// store.js (or zustandStore.js)
import { create } from "zustand";
import { getAllActivities } from "../actions/getActivities";

// Define the store
export const useStore = create((set) => ({
  accessToken: null, // will hold the access token
  activities: [], // will hold the activities
  isLoading: false, // loading state
  error: null, // to track any errors

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
      set({ activities: newActivities, isLoading: false });
    } catch (err) {
      // Handle any errors
      set({ isLoading: false, error: err.message });
    }
  },
}));
