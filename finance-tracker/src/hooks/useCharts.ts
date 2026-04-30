import { useQuery } from "@tanstack/react-query";
import { chartService } from "@/services/chartService";

export const useDailyChart = (year?: number, month?: number) => {
  return useQuery({
    queryKey: ["chart", "daily", year, month],
    queryFn: () => chartService.getDaily(year, month),
  });
};

export const useMonthlyChart = (year?: number) => {
  return useQuery({
    queryKey: ['chart', 'monthly', year],
    queryFn:  () => chartService.getMonthly(year),
  })
}