import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  transactionService,
  type TransactionType,
} from "@/services/transactionService";
import type { SummaryParams } from "@/services/transactionService";
import type { FilterType } from "@/services/transactionService";

// ─── Query Keys — dùng để invalidate cache ────────────────────────────────────
export const TRANSACTION_KEYS = {
  all: ["transactions"] as const,
  list: (page: number, filter: FilterType) =>
    ["transactions", "list", page, filter] as const,
  summary: (params: SummaryParams) =>
    ["transactions", "summary", params] as const,
};

// ─── Hook lấy danh sách giao dịch ─────────────────────────────────────────────
export const useTransactions = (page = 0, filter: FilterType = "ALL") => {
  return useQuery({
    queryKey: TRANSACTION_KEYS.list(page, filter),
    queryFn: () => transactionService.getAll(page, 20, filter),
  });
};

// ─── Hook lấy summary ─────────────────────────────────────────────────────────
export const useTransactionSummary = (params: SummaryParams = {}) => {
  return useQuery({
    queryKey: ["transactions", "summary", params], // cache riêng theo params
    queryFn: () => transactionService.getSummary(params),
  });
};

// ─── Payload type dùng chung cho create / update ──────────────────────────────
interface TransactionPayload {
  type: TransactionType;
  amount: number;
  note?: string;
  transactionDate: string;
}

// ─── Hook thêm giao dịch ──────────────────────────────────────────────────────
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TransactionPayload) =>
      transactionService.create(payload),

    // Invalidate cả list lẫn summary để cả 2 tự refetch
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.all });
    },
  });
};

// ─── Hook sửa giao dịch ───────────────────────────────────────────────────────
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: TransactionPayload;
    }) => transactionService.update(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
    },
  });
};

// ─── Hook xóa giao dịch ───────────────────────────────────────────────────────
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.all });
    },
  });
};
