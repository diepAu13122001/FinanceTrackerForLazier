export type GoalType = "SAVINGS" | "DEBT" | "INVESTMENT" | "NORMAL";
export type GoalSubtype = "CREDIT_CARD" | "INSTALLMENT";
export type GoalStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface GoalResponse {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: GoalType;
  subtype?: GoalSubtype | null;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  status: GoalStatus;
  createdAt: string;
  creditLimit?: number | null;
  billingDate?: number | null;
  interestRate?: number | null;
  // 👇 THÊM installment fields
  numberOfPeriods?: number | null;
  monthlyPayment?: number | null;
  initialAmount?: number | null;
  currentPeriod?: number | null; // computed by backend
  remainingPeriods?: number | null; // computed by backend
  progressPercent: number;
  remainingAmount: number;
  overLimit: boolean;
  balance: number;
}

export interface GoalRequest {
  name: string;
  icon?: string;
  color?: string;
  type: GoalType;
  subtype?: GoalSubtype | null;
  targetAmount?: number;
  deadline?: string | null;
  creditLimit?: number | null;
  billingDate?: number | null;
  // interestRate bỏ khỏi form
  // 👇 THÊM installment
  numberOfPeriods?: number | null;
  monthlyPayment?: number | null;
  initialAmount?: number | null;
}

export const GOAL_ICONS = [
  "wallet",
  "piggy-bank",
  "credit-card",
  "banknote",
  "home",
  "car",
  "plane",
  "graduation-cap",
  "heart",
  "briefcase",
  "laptop",
  "smartphone",
  "trending-up",
  "shield",
  "star",
  "gift",
] as const;

export type GoalIcon = (typeof GOAL_ICONS)[number];

export const GOAL_TYPE_CONFIG = {
  SAVINGS: {
    label: "Tích lũy",
    description: "Tiết kiệm cho mục tiêu cụ thể",
    icon: "piggy-bank",
    color: "#22c55e",
    bgClass: "bg-success-50",
    textClass: "text-success-600",
    borderClass: "border-success-200",
    emoji: "🐷",
  },
  DEBT: {
    label: "Khoản nợ",
    description: "Theo dõi và ưu tiên trả nợ",
    icon: "credit-card",
    color: "#ef4444",
    bgClass: "bg-danger-50",
    textClass: "text-danger-600",
    borderClass: "border-danger-300",
    emoji: "⚠️",
  },
  INVESTMENT: {
    label: "Đầu tư",
    description: "Theo dõi danh mục đầu tư",
    icon: "trending-up",
    color: "#3b82f6",
    bgClass: "bg-blue-50",
    textClass: "text-blue-600",
    borderClass: "border-blue-200",
    emoji: "📈",
  },
  NORMAL: {
    label: "Ví / Tài khoản",
    description: "Tiền mặt, tài khoản ngân hàng, ví điện tử...",
    icon: "wallet",
    color: "#8b5cf6",
    bgClass: "bg-violet-50",
    textClass: "text-violet-600",
    borderClass: "border-violet-200",
    emoji: "💰",
  },
} as const;
