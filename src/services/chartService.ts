import { api } from "@/lib/api";

// ─── Daily ────────────────────────────────────────────────────────────────────

export interface DailyChartData {
  date: string;
  income: number;
  expense: number;
}

export interface DailyChartParams {
  year?: number;
  month?: number;
  startMonth?: number;
  endMonth?: number;
}

// ─── Monthly ──────────────────────────────────────────────────────────────────

export interface MonthlyChartData {
  month: number;
  label: string;
  income: number;
  expense: number;
  balance: number;
}

// ─── Category chart ───────────────────────────────────────────────────────────

export interface CategoryChartData {
  categoryId: string | null;
  categoryName: string;
  categoryColor: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface CategoryChartParams {
  type: "INCOME" | "EXPENSE";
  year: number;
  month?: number; // tháng cụ thể (1-12)
  startMonth?: number; // bắt đầu quý
  endMonth?: number; // kết thúc quý
  // nếu không truyền month/startMonth/endMonth → cả năm
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const chartService = {
  getDaily: async (
    params: DailyChartParams = {},
  ): Promise<DailyChartData[]> => {
    const response = await api.get<DailyChartData[]>(
      "/api/transactions/chart/daily",
      { params },
    );
    return response.data;
  },

  getMonthly: async (year?: number): Promise<MonthlyChartData[]> => {
    const response = await api.get<MonthlyChartData[]>(
      "/api/transactions/chart/monthly",
      { params: { year } },
    );
    return response.data;
  },

  getCategoryChart: async (
    params: CategoryChartParams,
  ): Promise<CategoryChartData[]> => {
    const response = await api.get<CategoryChartData[]>(
      "/api/transactions/chart/categories",
      { params },
    );
    return response.data;
  },
};
