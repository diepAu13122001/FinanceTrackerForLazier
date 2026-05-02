import { useQuery } from "@tanstack/react-query";
import { chartService } from "@/services/chartService";

import type { DailyChartParams } from "@/services/chartService";

export const useDailyChart = (params: DailyChartParams) => {
  return useQuery({
    queryKey: ["chart", "daily", params],
    queryFn: () => chartService.getDaily(params),
  });
};

export const useMonthlyChart = (year?: number) => {
  return useQuery({
    queryKey: ["chart", "monthly", year],
    queryFn: () => chartService.getMonthly(year),
  });
};
