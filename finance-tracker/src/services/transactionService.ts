import { api } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TransactionType = "INCOME" | "EXPENSE";

export interface TransactionRequest {
  type: TransactionType;
  amount: number;
  note?: string;
  transactionDate: string; // "YYYY-MM-DD"
  currency?: string;
}

export interface TransactionResponse {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  note: string | null;
  transactionDate: string;
  source: string;
  createdAt: string;
}

export interface TransactionPage {
  content: TransactionResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  transactionLimit: number; // -1 = không giới hạn
  limitReached: boolean;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const transactionService = {
  create: async (data: TransactionRequest): Promise<TransactionResponse> => {
    const response = await api.post<TransactionResponse>(
      "/api/transactions",
      data,
    );
    return response.data;
  },

  getAll: async (page = 0, size = 20): Promise<TransactionPage> => {
    const response = await api.get<TransactionPage>("/api/transactions", {
      params: { page, size },
    });
    return response.data;
  },

  getSummary: async (): Promise<TransactionSummary> => {
    const response = await api.get<TransactionSummary>(
      "/api/transactions/summary",
    );
    return response.data;
  },

  update: async (
    id: string,
    data: TransactionRequest,
  ): Promise<TransactionResponse> => {
    const response = await api.put<TransactionResponse>(
      `/api/transactions/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/transactions/${id}`);
  },
};
