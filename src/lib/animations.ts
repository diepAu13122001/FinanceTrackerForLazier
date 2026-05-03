// Tập trung tất cả animation classes — dễ thay đổi đồng bộ
export const animations = {
  // Fade in từ dưới lên — dùng cho cards, modals
  fadeInUp: "animate-in fade-in slide-in-from-bottom-4 duration-300",

  // Fade in đơn giản — dùng cho overlay, tooltips
  fadeIn: "animate-in fade-in duration-200",

  // Scale in — dùng cho modal, popup
  scaleIn: "animate-in zoom-in-95 fade-in duration-200",

  // Slide in từ phải — dùng cho sidebar trên mobile
  slideInRight: "animate-in slide-in-from-right duration-300",

  // Slide in từ dưới — dùng cho bottom sheet
  slideInBottom: "animate-in slide-in-from-bottom duration-300",

  // Spin — loading
  spin: "animate-spin",

  // Pulse — skeleton
  pulse: "animate-pulse",
} as const;
