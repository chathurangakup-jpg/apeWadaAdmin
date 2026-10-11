import { AdminUser } from "@/types/auth.types";
import Cookies from "js-cookie";

//const USER_KEY = "apewada_admin_user";
const USER_KEY = "apewada_admin_token";

// JWT stored in HttpOnly cookie via API route
// Only non-sensitive user data stored in regular cookie/localStorage

export const authStorage = {
  // Store non-sensitive user info (NOT the JWT)
  setUser: (token: string): void => {
    if (typeof window !== "undefined") {
      Cookies.set(USER_KEY, JSON.stringify(token));
    }
  },

  getUser: (): AdminUser | null => {
    if (typeof window === "undefined") return null;
    const user = Cookies.get(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  clearAuth: async (): Promise<void> => {
    if (typeof window !== "undefined") {
      Cookies.remove(USER_KEY);
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    }
  },

  isAuthenticated: (): boolean => {
    return !!authStorage.getUser();
  },
};
