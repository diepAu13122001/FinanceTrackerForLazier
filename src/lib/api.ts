import axios from "axios";
import { notify, TOAST_MESSAGES } from "@/lib/toast";
import { useAuthStore } from "@/stores/authStore";

// ─── Tạo Axios instance với config mặc định ───────────────────────────────────
// axios.create() -> trả về một instnace mới của axios với config mặc định
// axios.get sẽ không cần nhắc lại baseURL/ headers/ interceptors nữa, vì đã được cấu hình sẵn ở đây
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 giây — tránh request treo mãi
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Chạy TRƯỚC khi request được gửi đi
// Tự động đính kèm JWT token vào mọi request

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Chạy SAU khi nhận response
// Xử lý các lỗi chung tập trung một chỗ

api.interceptors.response.use(
  // Response thành công — trả về bình thường
  (response) => response,

  // Response lỗi — xử lý tập trung
  (error) => {
    const status = error.response?.status;
    const errorCode = error.response?.data?.error;

    // 401 — token hết hạn hoặc không hợp lệ → tự động logout
    if (status === 401) {
      // Xóa cả store — không chỉ localStorage
      // Gọi trực tiếp store action thay vì chỉ xóa localStorage
      useAuthStore.getState().logout();

      notify.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 403 — không đủ plan → redirect sang pricing
    if (status === 403 && errorCode === "PLAN_UPGRADE_REQUIRED") {
      const requiredPlan = error.response?.data?.requiredPlan;
      window.location.href = `/pricing?required=${requiredPlan}`;
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
