import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import customerReducer from "./features/users/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
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
