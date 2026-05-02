import { api } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  planId: "FREE" | "PLUS" | "PREMIUM";
  message: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────
// Tách ra khỏi code component để dễ test, dễ tái sử dụng, và tập trung xử lý lỗi ở một chỗ (ở api.ts)
export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/auth/register", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/auth/login", data);
    return response.data;
  },
};
