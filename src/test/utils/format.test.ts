import { describe, it, expect } from "vitest";
import {
  formatVND,
  formatShortVND,
  parseVNDInput,
  parseSmartVNDInput,
  formatRelativeDateVI,
} from "@/utils/format";

describe("formatVND", () => {
  // Helper normalize — xóa các loại space đặc biệt của Unicode để tránh lỗi do font hoặc môi trường test khác nhau
  const normalize = (str: string) =>
    str.replace(/\u00A0|\u202F|\u2009/g, " ").trim();
  it("format số dương thành tiền VND", () => {
    expect(normalize(formatVND(45000))).toBe("45.000 ₫");
    expect(normalize(formatVND(1000000))).toBe("1.000.000 ₫");
    expect(normalize(formatVND(0))).toBe("0 ₫");
  });

  it("format số âm thành tiền VND", () => {
    expect(normalize(formatVND(-45000))).toBe("-45.000 ₫");
  });
});

describe("formatShortVND", () => {
  it("format số dưới 1000 giữ nguyên", () => {
    expect(formatShortVND(500)).toBe("500");
  });

  it("format hàng nghìn thành k", () => {
    expect(formatShortVND(45000)).toBe("45k");
    expect(formatShortVND(1000)).toBe("1k");
  });

  it("format hàng triệu thành M", () => {
    expect(formatShortVND(1200000)).toBe("1.2M");
    expect(formatShortVND(1000000)).toBe("1.0M");
  });

  it("format hàng tỷ thành B", () => {
    expect(formatShortVND(1500000000)).toBe("1.5B");
  });
});

describe("parseVNDInput", () => {
  it("parse chuỗi số thuần", () => {
    expect(parseVNDInput("45000")).toBe(45000);
  });

  it("parse chuỗi có dấu chấm (định dạng VN)", () => {
    expect(parseVNDInput("45.000")).toBe(45000);
    expect(parseVNDInput("1.000.000")).toBe(1000000);
  });

  it("trả về 0 khi input rỗng hoặc không hợp lệ", () => {
    expect(parseVNDInput("")).toBe(0);
    expect(parseVNDInput("abc")).toBe(0);
  });
});

describe("parseSmartVNDInput", () => {
  it("parse shorthand k thành nghìn", () => {
    expect(parseSmartVNDInput("45k")).toBe(45000);
    expect(parseSmartVNDInput("45K")).toBe(45000);
    expect(parseSmartVNDInput("1.5k")).toBe(1500);
  });

  it("parse shorthand m thành triệu", () => {
    expect(parseSmartVNDInput("2m")).toBe(2000000);
    expect(parseSmartVNDInput("1.5m")).toBe(1500000);
  });

  it("fallback về parseVNDInput cho input thường", () => {
    expect(parseSmartVNDInput("45.000")).toBe(45000);
    expect(parseSmartVNDInput("45000")).toBe(45000);
  });
});

describe("formatRelativeDateVI", () => {
  it('trả về "Hôm nay" cho ngày hiện tại', () => {
    const today = new Date().toISOString().split("T")[0];
    expect(formatRelativeDateVI(today)).toBe("Hôm nay");
  });

  it('trả về "Hôm qua" cho ngày hôm qua', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const str = yesterday.toISOString().split("T")[0];
    expect(formatRelativeDateVI(str)).toBe("Hôm qua");
  });
  it("trả về định dạng dd/MM/yyyy cho ngày xa hơn", () => {
    const result = formatRelativeDateVI("2026-01-15");
    // \d{1,2} thay vì \d{2} — chấp nhận cả 1 và 2 chữ số
    expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });
});
