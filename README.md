# 💰 Finance Tracker

Ứng dụng quản lý tài chính cá nhân với AI, được xây dựng cho thị trường Việt Nam.

🌐 **Demo:** [finance-tracker.vercel.app]([https://your-demo-url.vercel.app](https://finance-tracker-gxdy99t2b-diepau13122001s-projects.vercel.app)  
📹 **Video demo:** [YouTube](https://youtube.com/...)

---

## ✨ Tính Năng

### V1 — Core (Đã hoàn thành)
- 🔐 Xác thực JWT với hệ thống 3 gói (Free / Plus / Premium)
- 💸 CRUD giao dịch thu/chi với giới hạn 50 giao dịch/tháng cho Free
- 📊 Biểu đồ thu chi theo ngày và theo tháng
- 🔍 Filter giao dịch theo loại (Tất cả / Thu nhập / Chi tiêu)
- 📱 Responsive: Sidebar trên desktop, Bottom nav trên mobile

### V2 — Smart Features (Đang phát triển)
- 🤖 AI nhập giọng nói tiếng Việt
- 📂 Danh mục chi tiêu
- 🎯 Mục tiêu tài chính
- 💳 Thanh toán PayOS

### V3 — Premium (Kế hoạch)
- 🏠 Theo dõi đồ dùng gia đình
- 🔔 Thông báo hết hạn sản phẩm
- ⭐ Đánh giá sản phẩm

---

## 🛠 Tech Stack

### Frontend
| Công nghệ | Vai trò |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| TailwindCSS | Styling |
| TanStack Query | Server state management |
| Zustand | Client state management |
| React Hook Form + Zod | Form + validation |
| Recharts | Biểu đồ |
| React Router v6 | Routing |

### Backend
| Công nghệ | Vai trò |
|---|---|
| Spring Boot 3.3 + Java 21 | REST API |
| Spring Security + JWT | Authentication |
| Spring Data JPA + Hibernate | ORM |
| PostgreSQL | Database |
| Flyway | Database migration |
| Lombok | Code generation |

---

## 🏗 Kiến Trúc

```
Frontend (Vercel)          Backend (Railway/AWS)       Database
─────────────────          ─────────────────────       ────────
React App          ──→     Spring Boot API      ──→    PostgreSQL
  authStore               AuthController               users
  TanStack Query          TransactionController        transactions
  usePlan hook            UserController               user_subscriptions
  PlanGate                                             payment_history
```

### Database Schema

```
users ──────────── user_subscriptions ──── subscription_plans
  │                                               (FREE/PLUS/PREMIUM)
  └──── transactions
  └──── payment_history
```

---

## 🚀 Chạy Local

### Yêu Cầu
- Java 21+
- Node.js 18+
- PostgreSQL 15+

### Backend

```bash
# 1. Clone repo
git clone https://github.com/yourusername/finance-tracker-be

# 2. Tạo database
psql -U postgres -c "CREATE DATABASE finance_tracker;"
psql -U postgres -c "CREATE USER ft_user WITH PASSWORD 'ft_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE finance_tracker TO ft_user;"

# 3. Cấu hình application.yml
cp src/main/resources/application.yml.example src/main/resources/application.yml
# Điền thông tin database và JWT secret

# 4. Chạy — Flyway tự migrate schema
./mvnw spring-boot:run
# API chạy tại http://localhost:8080
```

### Frontend

```bash
# 1. Clone repo
git clone https://github.com/yourusername/finance-tracker-fe

# 2. Cài dependencies
npm install

# 3. Cấu hình env
cp .env.example .env
# VITE_API_URL=http://localhost:8080

# 4. Chạy dev server
npm run dev
# App chạy tại http://localhost:5173
```

---

## 📡 API Endpoints

### Auth
```
POST /api/auth/register   Đăng ký
POST /api/auth/login      Đăng nhập
```

### Transactions
```
GET    /api/transactions              Danh sách (phân trang, filter)
POST   /api/transactions              Tạo mới
PUT    /api/transactions/:id          Cập nhật
DELETE /api/transactions/:id          Xóa
GET    /api/transactions/summary      Tổng hợp theo kỳ
GET    /api/transactions/chart/daily  Biểu đồ ngày
GET    /api/transactions/chart/monthly Biểu đồ tháng
```

### Users
```
GET /api/users/me          Thông tin cá nhân
PUT /api/users/me          Cập nhật hồ sơ
PUT /api/users/me/password Đổi mật khẩu
```

---

## 🔒 Hệ Thống Phân Quyền

```
FREE    → 50 giao dịch/tháng, biểu đồ cơ bản
PLUS    → Không giới hạn, danh mục, AI 20 tin/tháng
PREMIUM → Tất cả Plus + AI không giới hạn + đồ dùng gia đình
```

Backend: `@RequiresPlan("PLUS")` annotation + AOP aspect  
Frontend: `<PlanGate requires="PLUS">` component + `usePlan()` hook

---

## 👨‍💻 Tác Giả

**Diệp Âu** — [GitHub](https://github.com/diepau13122001)
