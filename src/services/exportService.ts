import { api } from "@/lib/api";

export const exportService = {
  downloadExcel: async (year?: number, month?: number): Promise<void> => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());

    const response = await api.get(`/api/export/excel?${params}`, {
      responseType: "blob",
    });

    // Tạo link download tự động
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${year ?? "all"}_${month ?? "all"}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
