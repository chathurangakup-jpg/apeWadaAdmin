import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authStorage } from "./auth";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 15000,
  withCredentials: true, // Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStorage.getUser();
    console.log("Axios Request Interceptor: Token:", token); // Debugging line

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    // if (status === 401) {
    //   await authStorage.clearAuth();
    //   if (typeof window !== "undefined") {
    //     window.location.href = "/login";
    //   }
    // }

    if (status === 403) {
      // Handle forbidden
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
