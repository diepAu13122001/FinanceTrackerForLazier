import axios from "axios";
import { notify, TOAST_MESSAGES } from "@/lib/toast";
import { useAuthStore } from "@/stores/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // 🔄 SỬA: đọc từ Zustand store thay vì localStorage trực tiếp
    // Zustand persist lưu state dưới key "auth-storage", không phải "token"
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorCode = error.response?.data?.error;

    // 401 — token hết hạn hoặc không hợp lệ
    if (status === 401) {
      useAuthStore.getState().logout();
      notify.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 403 PLAN_UPGRADE_REQUIRED — redirect pricing
    if (status === 403 && errorCode === "PLAN_UPGRADE_REQUIRED") {
      const requiredPlan = error.response?.data?.requiredPlan;
      window.location.href = `/pricing?required=${requiredPlan}`;
      return Promise.reject(error);
    }

    // 👇 THÊM MỚI: network error (server restart, offline)
    if (!error.response) {
      // Network error — server chưa ready hoặc offline
      // Không logout, chỉ báo lỗi để user biết
      console.warn(
        "[API] Network error — server may be restarting",
        error.message,
      );
      // Không notify ở đây — để từng component tự handle
    }

    return Promise.reject(error);
  },
);
