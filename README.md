# Finance Tracker — Frontend

React app quản lý tài chính cá nhân với hệ thống
plan gating (Free/Plus/Premium).

**CI frontend:** [![CI]](https://github.com/diepAu13122001/finance-tracker-fe/blob/main/.github/workflows/ci-frontend.yml)

**Live App:** https://finance-tracker-fe-rho.vercel.app

---

## Tech Stack & Lý Do Chọn

| Công nghệ | Vai trò | Tại sao chọn |
|---|---|---|
| React 18 + TypeScript | UI | Type safety, IDE support tốt |
| TanStack Query | Server state | Auto cache, loading, error handling |
| Zustand | Client state | Đơn giản hơn Redux, persist built-in |
| React Hook Form + Zod | Form + validation | Ít re-render, schema validation |
| TailwindCSS | Styling | Utility-first, không cần đặt tên class |
| Recharts | Charts | Declarative API, responsive |
| Vite | Build tool | Fast HMR, build nhanh hơn CRA |

---

## Kiến Trúc Quan Trọng

### Plan Gating Với Component

```tsx
// Mirror với @RequiresPlan ở backend
<PlanGate requires="PLUS">
  <CategoryPieChart />   // chỉ render nếu user >= PLUS
</PlanGate>

// usePlan hook đọc từ JWT trong authStore
const { isPlus, canUse } = usePlan()
```

### TanStack Query Cache Strategy
```
staleTime: 5 phút
→ Data được dùng từ cache trong 5 phút
→ Tránh fetch lại khi navigate qua lại
invalidateQueries(['transactions'])
→ Sau khi create/update/delete
→ Prefix match: invalidate cả list lẫn summary
```
---

## Cấu Trúc Thư Mục
```
src/
├── components/
│   ├── shared/       Button, Input, Card, PlanGate...
│   ├── layout/       AppLayout, Sidebar, TopBar, BottomNav
│   ├── transactions/ TransactionList, Modal, FilterTabs
│   ├── dashboard/    SummaryCards, SummaryCard
│   ├── charts/       DailyBarChart, MonthlyTrendChart
│   └── pricing/      PlanCard, FeatureRow
├── pages/            Dashboard, Expenses, Analytics...
├── hooks/            usePlan, useTransactions, useCharts
├── stores/           authStore (Zustand + persist)
├── services/         API calls (Axios instance)
├── utils/            formatVND, parseVNDInput, errorUtils
├── lib/              api.ts, toast.ts, design-system.ts
└── types/            plans.ts (PlanId, Feature, PLAN_LEVELS)
```

---

## Setup Local

```bash
npm install

# .env
VITE_API_URL=http://localhost:8080

npm run dev
# App: http://localhost:5173
```

---

## Tests

```bash
npm run test:run

# Test files:
# format.test.ts    — 12 test cases
# usePlan.test.ts   — 10 test cases
# PlanGate.test.tsx — 8 test cases
```

---

## Responsive Design
```
Desktop (≥768px):  Sidebar navigation
Mobile  (<768px):  Bottom navigation + FAB button
```
