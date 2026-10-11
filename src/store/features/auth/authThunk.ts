import { authStorage } from "@/lib/auth";
import { AdminUser, LoginRequest, LoginResponse } from "@/types/auth.types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { authService } from "./authService";

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials);
    authStorage.setUser(data.token);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
    return rejectWithValue("An unexpected error occurred.");
  }
});

export const logoutUser = createAsyncThunk<void, void>(
  "auth/logout",
  async () => {
    try {
      await authService.logout();
    } finally {
      await authStorage.clearAuth();
    }
  },
);

export const fetchProfile = createAsyncThunk<
  AdminUser,
  void,
  { rejectValue: string }
>("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    return await authService.getProfile();
  } catch (error) {
    return rejectWithValue("Failed to fetch profile");
  }
});
