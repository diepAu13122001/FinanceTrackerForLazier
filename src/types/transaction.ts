import type { CategoryResponse } from "./category";
import type { GoalResponse } from "./goal";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type TransactionType = "INCOME" | "EXPENSE";
export type FilterType = "ALL" | "INCOME" | "EXPENSE";

// ─── Request gửi lên API ──────────────────────────────────────────────────────

export interface TransactionRequest {
  type: TransactionType;
  amount: number;
  note?: string;
  transactionDate: string; // "YYYY-MM-DD"
  currency?: string;
  categoryId?: string | null; // null/undefined = không phân loại
  goalId?: string | null;
}

// ─── Response từ API ──────────────────────────────────────────────────────────

export interface TransactionResponse {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  note: string | null;
  transactionDate: string;
  source: string;
  createdAt: string;
  category: CategoryResponse | null; // null nếu chưa phân loại
  goal: GoalResponse | null;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface TransactionPage {
  content: TransactionResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ─── Summary ──────────────────────────────────────────────────────────────────

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  transactionLimit: number; // -1 = không giới hạn
  limitReached: boolean;
}

export interface SummaryParams {
  year?: number;
  month?: number; // 1-12
  quarter?: number; // 1-4
}
