import { api } from "@/lib/api";
import type {
  CategoryRequest,
  CategoryResponse,
  TransactionType,
} from "@/types/category";

export const categoryService = {
  /**
   * Lấy danh sách categories.
   * Optional: filter theo type INCOME hoặc EXPENSE.
   */
  getAll: async (type?: TransactionType): Promise<CategoryResponse[]> => {
    const params = type ? { type } : undefined;
    const { data } = await api.get<CategoryResponse[]>("/api/categories", {
      params,
    });
    return data;
  },

  /**
   * Tạo category mới.
   */
  create: async (request: CategoryRequest): Promise<CategoryResponse> => {
    const { data } = await api.post<CategoryResponse>(
      "/api/categories",
      request,
    );
    return data;
  },

  /**
   * Update category.
   */
  update: async (
    id: string,
    request: CategoryRequest,
  ): Promise<CategoryResponse> => {
    const { data } = await api.put<CategoryResponse>(
      `/api/categories/${id}`,
      request,
    );
    return data;
  },

  /**
   * Xóa category. Transactions liên quan sẽ có category_id = NULL.
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/categories/${id}`);
  },
};
