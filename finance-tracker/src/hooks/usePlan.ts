import { canUseFeature, PLAN_LEVELS, PLAN_CONFIG } from "@/types/plans";
import type { PlanId, Feature } from "@/types/plans";

// ─── Tạm thời hardcode — Tuần 2 sẽ thay bằng authStore ───────────────────────
// Hiện tại chưa có backend/auth, dùng biến này để test
// Đổi thành 'FREE' | 'PLUS' | 'PREMIUM' để xem UI thay đổi
const MOCK_PLAN: PlanId = "PREMIUM";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const usePlan = () => {
  // Tuần 2: thay dòng này bằng: const plan = useAuthStore(s => s.user?.subscription?.planId ?? 'FREE')
  const plan: PlanId = MOCK_PLAN;

  return {
    // Gói hiện tại
    plan,

    // Shorthand kiểm tra gói
    isFree: (plan as PlanId) === "FREE",
    isPlus: PLAN_LEVELS[plan] >= PLAN_LEVELS["PLUS"],
    isPremium: (plan as PlanId) === "PREMIUM",

    // Kiểm tra một tính năng cụ thể
    canUse: (feature: Feature) => canUseFeature(plan, feature),

    // Thông tin gói để hiển thị UI
    planConfig: PLAN_CONFIG[plan],

    // Kiểm tra có đủ level không (dùng trong PlanGate)
    hasLevel: (required: PlanId) => PLAN_LEVELS[plan] >= PLAN_LEVELS[required],
  };
};
