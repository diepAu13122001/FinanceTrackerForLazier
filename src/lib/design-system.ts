export const DS = {
  // Layout
  card: "bg-surface rounded-xl border border-surface-border p-6 shadow-sm",
  cardMuted: "bg-surface-muted rounded-xl border border-surface-border p-6",

  // Typography
  heading1: "text-2xl font-bold text-text-primary tracking-tight",
  heading2: "text-xl font-semibold text-text-primary",
  heading3: "text-base font-semibold text-text-primary",
  label: "text-sm font-medium text-text-secondary",
  body: "text-sm text-text-primary",
  muted: "text-sm text-text-muted",

  // Form elements
  inputBase: [
    "w-full rounded-lg border border-surface-border bg-surface",
    "px-3 py-2 text-sm text-text-primary",
    "placeholder:text-text-muted",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),

  // Buttons
  btnPrimary: [
    "inline-flex items-center justify-center rounded-lg",
    "bg-primary-500 text-white text-sm font-medium",
    "px-4 py-2",
    "hover:bg-primary-600 active:bg-primary-700",
    "focus-visible:outline-none focus:ring-2 focus:ring-primary-500",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-colors duration-150",
  ].join(" "),

  btnGhost: [
    "inline-flex items-center justify-center rounded-lg",
    "bg-transparent text-text-secondary text-sm font-medium",
    "px-4 py-2",
    "hover:bg-surface-muted hover:text-text-primary",
    "focus-visible:outline-none focus:ring-2 focus:ring-primary-500",
    "transition-colors duration-150",
    "outline-none",
  ].join(" "),

  btnDanger: [
    "inline-flex items-center justify-center rounded-lg",
    "bg-danger-500 text-white text-sm font-medium",
    "px-4 py-2",
    "hover:bg-danger-600 active:bg-danger-700",
    "focus-visible:outline-none focus:ring-2 focus:ring-danger-500",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-colors duration-150",
    "outline-none",
  ].join(" "),

  // Đặc biệt: gradient vàng cho các CTA nâng cấp
  btnPremium: [
    "inline-flex items-center justify-center rounded-lg",
    "bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-sm font-semibold",
    "px-4 py-2",
    "hover:from-amber-500 hover:to-yellow-600",
    "focus-visible:outline-none focus:ring-2 focus:ring-amber-400",
    "shadow-md shadow-amber-200",
    "transition-all duration-150",
    "outline-none",
  ].join(" "),

  // Badges
  badge:
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  badgePrimary: "bg-primary-50 text-primary-700",
  badgeSuccess: "bg-success-50 text-success-600",
  badgeDanger: "bg-danger-50 text-danger-600",
  badgePremium: "bg-amber-50 text-amber-700",
} as const;
