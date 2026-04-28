// ─── Format tiền VND ──────────────────────────────────────────────────────────

/**
 * Format đầy đủ: 45000 → "45.000 ₫"
 */
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Format rút gọn: 1200000 → "1,2M" | 45000 → "45k"
 * Dùng cho trục Y của chart
 */
export const formatShortVND = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}k`;
  }
  return amount.toString();
};

/**
 * Parse input của user: "45.000" hoặc "45000" → 45000
 * Người dùng có thể gõ có dấu chấm hoặc không
 */
export const parseVNDInput = (value: string): number => {
  const cleaned = value.replace(/\./g, "").replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
};

/**
 * Format ngày theo chuẩn Việt Nam: 2026-01-14 → "14/01/2026"
 */
export const formatDateVI = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN").format(d);
};
