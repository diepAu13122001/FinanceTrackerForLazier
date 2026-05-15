import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { goalService } from "@/services/goalService";
import type { GoalRequest } from "@/types/goal";
import { notify } from "@/lib/toast";
import { getApiErrorMessage } from "@/utils/errorUtils";

export const GOAL_KEYS = {
  all: ["goals"] as const,
  active: ["goals", "active"] as const,
};

const invalidateGoals = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: GOAL_KEYS.all });
};

export const useGoals = () =>
  useQuery({
    queryKey: GOAL_KEYS.all,
    queryFn: goalService.getAll,
    staleTime: 2 * 60 * 1000,
  });

export const useActiveGoals = () =>
  useQuery({
    queryKey: GOAL_KEYS.active,
    queryFn: goalService.getActive,
    staleTime: 2 * 60 * 1000,
  });

export const useCreateGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: GoalRequest) => goalService.create(req),
    onSuccess: (data) => {
      invalidateGoals(qc);
      notify.success(`Đã tạo mục tiêu "${data.name}"`);
    },
    onError: (err) => notify.error(getApiErrorMessage(err)),
  });
};

export const useUpdateGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: GoalRequest }) =>
      goalService.update(id, request),
    onSuccess: (data) => {
      invalidateGoals(qc);
      notify.success(`Đã cập nhật "${data.name}"`);
    },
    onError: (err) => notify.error(getApiErrorMessage(err)),
  });
};

export const useCancelGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => goalService.cancel(id),
    onSuccess: () => {
      invalidateGoals(qc);
      notify.success("Đã huỷ mục tiêu");
    },
    onError: (err) => notify.error(getApiErrorMessage(err)),
  });
};

export const useDeleteGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => goalService.delete(id),
    onSuccess: () => {
      invalidateGoals(qc);
      qc.invalidateQueries({ queryKey: ["transactions"] });
      notify.success("Đã xóa mục tiêu");
    },
    onError: (err) => notify.error(getApiErrorMessage(err)),
  });
};
