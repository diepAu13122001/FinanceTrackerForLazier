import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";

// ─── Query Keys — dùng để invalidate cache ────────────────────────────────────
export const TRANSACTION_KEYS = {
  all: ["transactions"] as const,
  list: (page: number) => ["transactions", "list", page] as const,
  summary: ["transactions", "summary"] as const,
};

// ─── Hook lấy danh sách giao dịch ─────────────────────────────────────────────
export const useTransactions = (page = 0) => {
  return useQuery({
    queryKey: TRANSACTION_KEYS.list(page),
    queryFn: () => transactionService.getAll(page),
  });
};

// ─── Hook lấy summary ─────────────────────────────────────────────────────────
export const useTransactionSummary = () => {
  return useQuery({
    queryKey: TRANSACTION_KEYS.summary,
    queryFn: transactionService.getSummary,
  });
};

// ─── Hook xóa giao dịch ───────────────────────────────────────────────────────
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.delete(id),

    // Sau khi xóa thành công → invalidate cache → tự động refetch
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.all });
    },
  });
};
