import { api } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TransactionType = "INCOME" | "EXPENSE";
export type FilterType = "ALL" | "INCOME" | "EXPENSE";

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

export interface SummaryParams {
  year?: number;
  month?: number; // 1-12
  quarter?: number; // 1-4
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

  getAll: async (
    page = 0,
    size = 20,
    filter: FilterType = "ALL",
  ): Promise<TransactionPage> => {
    const params: Record<string, any> = { page, size };
    if (filter !== "ALL") params.type = filter;

    const response = await api.get<TransactionPage>("/api/transactions", {
      params,
    });
    return response.data;
  },

  getSummary: async (
    params: SummaryParams = {},
  ): Promise<TransactionSummary> => {
    const response = await api.get<TransactionSummary>(
      "/api/transactions/summary",
      {
        params, // axios tự convert thành ?year=2026&month=1
      },
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
