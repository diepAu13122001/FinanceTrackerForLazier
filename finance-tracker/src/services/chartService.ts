import { api } from "@/lib/api";

export interface DailyChartData {
  date: string;
  income: number;
  expense: number;
}

export interface MonthlyChartData {
  month: number; // 1-12
  label: string; // "Th1", "Th2"...
  income: number;
  expense: number;
}

export const chartService = {
  getDaily: async (
    year?: number,
    month?: number,
  ): Promise<DailyChartData[]> => {
    const response = await api.get<DailyChartData[]>(
      "/api/transactions/chart/daily",
      {
        params: { year, month },
      },
    );
    return response.data;
  },
};
