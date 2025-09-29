import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST", // If using redux-persist later
          "singleHotel/fetchSingleHotel/fulfilled",
          "singleHotel/updateSingleHotel/fulfilled",
        ],
        ignoredPaths: ["singleHotel.hotel"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});
