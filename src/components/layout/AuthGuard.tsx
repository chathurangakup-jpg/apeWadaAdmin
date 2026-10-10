// src/components/layout/AuthGuard.tsx
"use client";

import { authStorage } from "@/lib/auth";
import {
  selectIsAuthenticated,
  selectUser,
} from "@/store/features/auth/authSelector";
import { setUser } from "@/store/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!user) {
      const storedUser = authStorage.getUser();
      if (storedUser) {
        dispatch(setUser(storedUser));
      } else {
        router.replace("/login");
      }
    }
    setHydrated(true);
  }, [user, dispatch, router]);

  const showLoader = !hydrated || (!isAuthenticated && !user);

  return (
    <>
      {/* ✅ {children} ALWAYS in the render tree */}
      {children}

      {/* Loader as an overlay, not a replacement */}
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      )}
    </>
  );
}
