import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import { LoginRequest, LoginResponse } from "@/types/auth.types";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log("Logging in with credentials:", credentials);
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials,
    );
    console.log("Login response:", response.data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post("/admin/auth/logout");
  },

  getProfile: async (): Promise<LoginResponse["admin"]> => {
    const response = await axiosInstance.get<
      ApiResponse<LoginResponse["admin"]>
    >("/admin/auth/profile");
    return response.data.data;
  },
};
