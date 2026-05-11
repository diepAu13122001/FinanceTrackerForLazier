import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";
import type {
  FilterType,
  SummaryParams,
  TransactionRequest,
} from "@/types/transaction";
import { notify, TOAST_MESSAGES } from "@/lib/toast";

// ─── Query Keys — dùng để invalidate cache ────────────────────────────────────
export const TRANSACTION_KEYS = {
  all: ["transactions"] as const,
  list: (page: number, filter: FilterType, categoryId?: string) =>
    ["transactions", "list", page, filter, categoryId] as const,
  summary: (params: SummaryParams) =>
    ["transactions", "summary", params] as const,
};

// helper invalidate tất cả cần thiết sau mỗi mutation
const invalidateAll = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["transactions"] });
  queryClient.invalidateQueries({ queryKey: ["chart"] });
  queryClient.invalidateQueries({ queryKey: ["categories"] });
  queryClient.invalidateQueries({ queryKey: ["goals"] });  
};

// ─── Hook lấy danh sách giao dịch ─────────────────────────────────────────────
export const useTransactions = (
  page = 0,
  filter: FilterType = "ALL",
  categoryId?: string,
) => {
  return useQuery({
    queryKey: TRANSACTION_KEYS.list(page, filter, categoryId),
    queryFn: () => transactionService.getAll(page, 20, filter, categoryId),
  });
};

// ─── Hook lấy summary ─────────────────────────────────────────────────────────
export const useTransactionSummary = (params: SummaryParams = {}) => {
  return useQuery({
    queryKey: ["transactions", "summary", params],
    queryFn: () => transactionService.getSummary(params),
  });
};

// ─── Hook thêm giao dịch ──────────────────────────────────────────────────────
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransactionRequest) =>
      transactionService.create(payload),
    onSuccess: () => {
      invalidateAll(queryClient);
      notify.success(TOAST_MESSAGES.transaction.created);
    },
    onError: () => {
      notify.error(TOAST_MESSAGES.transaction.error);
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
      payload: TransactionRequest;
    }) => transactionService.update(id, payload),
    onSuccess: () => {
      invalidateAll(queryClient);
      notify.success(TOAST_MESSAGES.transaction.updated);
    },
    onError: () => {
      notify.error(TOAST_MESSAGES.transaction.error);
    },
  });
};

// ─── Hook xóa giao dịch ───────────────────────────────────────────────────────
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      invalidateAll(queryClient);
      notify.success(TOAST_MESSAGES.transaction.deleted);
    },
  });
};
