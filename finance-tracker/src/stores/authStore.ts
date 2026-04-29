import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanId } from "@/types/plans";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
  email: string;
  firstName: string;
  planId: PlanId;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;

  // Actions
  setAuth: (user: AuthUser, token: string) => void;
  logout: (queryClient?: { clear: () => void }) => void;

  // Computed helpers
  isLoggedIn: () => boolean;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        localStorage.setItem("token", token); // interceptor Axios vẫn đọc từ đây
        set({ user, token });
      },

      logout: (queryClient) => {
        localStorage.removeItem("token");
        queryClient?.clear(); // xóa toàn bộ cache TanStack Query
        set({ user: null, token: null });
      },

      isLoggedIn: () => get().token !== null && get().user !== null,
    }),
    {
      name: "auth-storage", // key trong localStorage
      // Chỉ persist token và user — không persist các function
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);
