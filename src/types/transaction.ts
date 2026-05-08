import type { CategoryResponse } from "./category";

// TransactionRequest — thêm field mới
interface TransactionRequest {
  type: "INCOME" | "EXPENSE";
  amount: number;
  note?: string;
  transactionDate: string;
  categoryId?: string | null; // 👈 THÊM MỚI
}

// TransactionResponse — thêm category object
interface TransactionResponse {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  note?: string;
  transactionDate: string;
  category?: CategoryResponse | null; // 👈 THÊM MỚI
  // ... các field khác
}
