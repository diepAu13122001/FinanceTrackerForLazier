export type GoalType = "SAVINGS" | "DEBT" | "INVESTMENT";
export type GoalStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface GoalResponse {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  status: GoalStatus;
  createdAt: string;
  progressPercent: number;
  remainingAmount: number;
  overLimit: boolean;
}

export interface GoalRequest {
  name: string;
  icon?: string;
  color?: string;
  type: GoalType;
  targetAmount: number;
  deadline?: string | null;
}

// Icons phù hợp cho goals
export const GOAL_ICONS = [
  "target",
  "piggy-bank",
  "credit-card",
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
  "banknote",
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
  },
  DEBT: {
    label: "Trả nợ",
    description: "Theo dõi và ưu tiên trả nợ",
    icon: "credit-card",
    color: "#ef4444",
    bgClass: "bg-danger-50",
    textClass: "text-danger-600",
    borderClass: "border-danger-300",
  },
  INVESTMENT: {
    label: "Đầu tư",
    description: "Theo dõi danh mục đầu tư",
    icon: "trending-up",
    color: "#3b82f6",
    bgClass: "bg-blue-50",
    textClass: "text-blue-600",
    borderClass: "border-blue-200",
  },
} as const;
