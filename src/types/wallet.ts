export type WalletType = "NORMAL" | "DEBT";
export type WalletSubtype = "CREDIT_CARD" | "INSTALLMENT";
export type WalletStatus = "ACTIVE" | "CANCELLED";

export interface WalletResponse {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: WalletType;
  subtype?: WalletSubtype | null;
  currentAmount: number; // NORMAL: balance; DEBT: số nợ
  creditLimit?: number | null;
  billingDate?: number | null;
  numberOfPeriods?: number | null;
  monthlyPayment?: number | null;
  initialAmount?: number | null;
  status: WalletStatus;
  createdAt: string;
  // Computed từ backend
  balance: number; // alias currentAmount
  progressPercent: number; // DEBT: (currentAmount/creditLimit)*100
  remainingAmount: number; // DEBT: max(creditLimit - currentAmount, 0)
  overLimit: boolean; // DEBT: currentAmount > creditLimit
}

export interface WalletRequest {
  name: string;
  icon?: string;
  color?: string;
  type: WalletType;
  subtype?: WalletSubtype | null;
  creditLimit?: number | null;
  billingDate?: number | null;
  numberOfPeriods?: number | null;
  monthlyPayment?: number | null;
  initialAmount?: number | null;
}

export const WALLET_ICONS = [
  "wallet",
  "credit-card",
  "banknote",
  "piggy-bank",
  "building",
  "landmark",
  "smartphone",
  "briefcase",
  "home",
  "car",
  "coins",
  "dollar-sign",
] as const;

export const WALLET_TYPE_CONFIG = {
  NORMAL: {
    label: "Ví / Tài khoản",
    icon: "wallet",
    color: "#8b5cf6",
    bgClass: "bg-violet-50",
    textClass: "text-violet-600",
    borderClass: "border-violet-200",
    emoji: "💰",
  },
  DEBT: {
    label: "Khoản nợ",
    icon: "credit-card",
    color: "#ef4444",
    bgClass: "bg-danger-50",
    textClass: "text-danger-600",
    borderClass: "border-danger-300",
    emoji: "⚠️",
  },
} as const satisfies Record<
  WalletType,
  {
    label: string;
    icon: string;
    color: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    emoji: string;
  }
>;
