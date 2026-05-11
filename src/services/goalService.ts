import { api } from "@/lib/api";
import type { GoalRequest, GoalResponse } from "@/types/goal";

export const goalService = {
  getAll: async (): Promise<GoalResponse[]> => {
    const { data } = await api.get<GoalResponse[]>("/api/goals");
    return data;
  },

  getActive: async (): Promise<GoalResponse[]> => {
    const { data } = await api.get<GoalResponse[]>("/api/goals/active");
    return data;
  },

  create: async (request: GoalRequest): Promise<GoalResponse> => {
    const { data } = await api.post<GoalResponse>("/api/goals", request);
    return data;
  },

  update: async (id: string, request: GoalRequest): Promise<GoalResponse> => {
    const { data } = await api.put<GoalResponse>(`/api/goals/${id}`, request);
    return data;
  },

  cancel: async (id: string): Promise<GoalResponse> => {
    const { data } = await api.patch<GoalResponse>(`/api/goals/${id}/cancel`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/goals/${id}`);
  },
};
