# Finance Tracker — Frontend

React app quản lý tài chính cá nhân với hệ thống
plan gating (Free/Plus/Premium).

[![CI](https://github.com/diepau1312/finance-tracker-fe/actions/workflows/ci-frontend.yml/badge.svg)](https://github.com/diepau1312/finance-tracker-fe/actions)

**Live App:** https://finance-tracker-fe-rho.vercel.app

---

## Tech Stack & Lý Do Chọn

| Công nghệ             | Vai trò           | Tại sao chọn                                   |
| --------------------- | ----------------- | ---------------------------------------------- |
| React 18 + TypeScript | UI                | Type safety, IDE support                       |
| TanStack Query        | Server state      | Auto cache, invalidation, loading/error states |
| Zustand               | Client state      | Đơn giản hơn Redux, built-in persist           |
| React Hook Form + Zod | Form + validation | Ít re-render, type-safe schema                 |
| TailwindCSS           | Styling           | Utility-first, không đặt tên class             |
| Recharts              | Charts            | Declarative API, custom tooltip                |
| Vite                  | Build tool        | HMR nhanh, build nhanh                         |

---

## Kiến Trúc Quan Trọng

### Plan Gating — 2 Layer

```tsx
// Layer 1: Backend (@RequiresPlan AOP)
// Layer 2: Frontend — 2 patterns:

// Pattern A: PlanGate component (hide UI)
<PlanGate requires="PLUS">
  <CategorySelector /> // không render nếu Free
</PlanGate>;

// Pattern B: usePlan hook (conditional logic)
const { isPlus } = usePlan();
if (!isPlus) return <UpgradePrompt />;
// Chỉ fetch API nếu Plus — tránh 403 → redirect loop
```

### Cache Invalidation Strategy

```typescript
// Sau mỗi transaction mutation: invalidate TẤT CẢ related queries
const invalidateAll = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ["transactions"] });
  queryClient.invalidateQueries({ queryKey: ["chart"] }); // pie, daily, monthly
  queryClient.invalidateQueries({ queryKey: ["categories"] }); // totalAmount update
  queryClient.invalidateQueries({ queryKey: ["goals"] }); // currentAmount update
};
// Đảm bảo UI luôn consistent sau mọi mutation
```

### Goal Progress — Recalculate Pattern

```
Transaction create/update/delete
     ↓ Backend
     SELECT SUM(amount) WHERE goal_id = ?
     SET goal.current_amount = result
     Auto-complete / Auto-revert status
     ↓ Frontend
     invalidate ["goals"] → refetch → hiện data mới
```

---

## Cấu Trúc Thư Mục

```
src/
├── components/
│   ├── shared/       Button, Input, Card, PlanGate, UpgradePrompt...
│   ├── layout/       AppLayout, Sidebar, TopBar, BottomNav
│   ├── transactions/ TransactionList, Modal, FilterTabs, Item
│   ├── dashboard/    SummaryCards, TopGoalsWidget
│   ├── charts/       DailyBarChart, MonthlyTrendChart, CategoryPieChart
│   ├── categories/   CategoryCard, CategorySelector, CategoryFormModal
│   │                 CategoryTransactionsDrawer, CategoryBadge
│   └── goals/        GoalCard, GoalProgressBar, GoalSelector
│                     GoalFormModal, FreedomNumberCalculator
├── pages/
│   Dashboard, ExpensesPage, AnalyticsPage, CategoriesPage,
│   GoalsPage, SettingsPage, PricingPage, LoginPage, RegisterPage
├── hooks/
│   useTransactions, useCategories, useGoals, useCharts, usePlan
├── services/
│   transactionService, categoryService, goalService, chartService
├── types/
│   transaction.ts, category.ts, goal.ts, plans.ts
└── utils/
    format.ts, errorUtils.ts
```

---

## Features V1 → V2

| Feature                   | V1 (Free)   | V2 Plus           |
| ------------------------- | ----------- | ----------------- |
| Transactions CRUD         | ✅ 50/tháng | ✅ Không giới hạn |
| Summary dashboard         | ✅          | ✅                |
| Biểu đồ cơ bản            | ✅          | ✅                |
| Categories                | ❌          | ✅ V2.1           |
| Pie chart theo category   | ❌          | ✅ V2.1           |
| Financial Goals           | ❌          | ✅ V2.2           |
| Goal progress tracking    | ❌          | ✅ V2.2           |
| Freedom Number Calculator | ❌          | ✅ V2.2           |
| AI Assistant              | ❌          | 🚧 V2.3           |
| PayOS Payment             | ❌          | 🚧 V2.3           |

---

## Setup Local

```bash
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:8080
npm run dev
# App: http://localhost:5173
```

---

## Tests

```bash
npm run test:run

# Test files:
# format.test.ts    — 12 cases
# usePlan.test.ts   — 10 cases
# PlanGate.test.tsx — 8 cases
```

---

## Responsive Design

```
Desktop (≥768px): Sidebar navigation
Mobile  (<768px): Bottom nav (5 items: Home, Household, Analytics⭐, Goals, AI)
                  Hidden pages (Categories, Settings, Expenses):
                  → Accessible từ Dashboard quick nav
                  → Back button ← Home trên mobile header
```

---

## 👨‍💻 Tác Giả

**Diệp Âu**
[GitHub](https://github.com/diepau13122001) ·
[Email](mailto:diepau1312@gmail.com)
