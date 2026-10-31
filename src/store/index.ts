import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import jobReducer from "./features/jobs/jobSlice";
import customerReducer from "./features/users/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    jobs: jobReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
