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

/**
 * Hôm nay → "Hôm nay"
 * Hôm qua → "Hôm qua"
 * Khác    → "14/01/2026"
 */
export const formatRelativeDateVI = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Hôm nay";
  if (isYesterday) return "Hôm qua";
  return formatDateVI(dateStr);
};

// Thêm vào format.ts
/**
 * Cho phép gõ tắt: "45k" → 45000, "1.5m" → 1500000
 */
export const parseSmartVNDInput = (value: string): number => {
  const lower = value.toLowerCase().trim();

  if (lower.endsWith("k")) {
    return parseFloat(lower) * 1_000;
  }
  if (lower.endsWith("m")) {
    return parseFloat(lower) * 1_000_000;
  }
  if (lower.endsWith("b")) {
    return parseFloat(lower) * 1_000_000_000;
  }

  return parseVNDInput(value);
};
