import { api } from "@/lib/api";
import type {
  FilterType,
  SummaryParams,
  TransactionPage,
  TransactionRequest,
  TransactionResponse,
  TransactionSummary,
} from "@/types/transaction";

// ✅ Re-export types để code cũ vẫn compile
// (nếu nơi khác đang `import { TransactionType } from '@/services/transactionService'`)
export type {
  TransactionType,
  FilterType,
  TransactionRequest,
  TransactionResponse,
  TransactionPage,
  TransactionSummary,
  SummaryParams,
} from "@/types/transaction";

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
    const params: Record<string, unknown> = { page, size };
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
      { params },
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
