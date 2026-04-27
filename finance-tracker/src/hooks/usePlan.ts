import { useAuthStore } from "@/stores/authStore";
import { canUseFeature, PLAN_LEVELS, PLAN_CONFIG } from "@/types/plans";
import type { PlanId, Feature } from "@/types/plans";

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const usePlan = () => {
  const planId = useAuthStore((s) => s.user?.planId ?? "FREE") as PlanId;

  return {
    // Gói hiện tại
    plan: planId,

    // Shorthand kiểm tra gói
    isFree: planId === "FREE",
    isPlus: PLAN_LEVELS[planId] >= PLAN_LEVELS["PLUS"],
    isPremium: planId === "PREMIUM",

    // Kiểm tra một tính năng cụ thể
    canUse: (feature: Feature) => canUseFeature(planId, feature),

    // Thông tin gói để hiển thị UI
    planConfig: PLAN_CONFIG[planId],

    // Kiểm tra có đủ level không (dùng trong PlanGate)
    hasLevel: (required: PlanId) =>
      PLAN_LEVELS[planId] >= PLAN_LEVELS[required],
  };
};
