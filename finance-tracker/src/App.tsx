import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DS } from '@/lib/design-system'
import { PrivateRoute } from '@/components/shared/PrivateRoute'
import { AppLayout } from '@/components/layout/AppLayout'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const PricingPage = lazy(() => import('@/pages/PricingPage'))
const DevKit = lazy(() => import('@/pages/DevKit'))

// Placeholder pages — sẽ xây dựng ở các ngày tiếp theo
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8">
    <h1 className={DS.heading1}>{title}</h1>
    <p className={DS.muted}>Trang này sẽ được xây dựng sớm.</p>
  </div>
)

function App() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <p className={DS.muted}>Đang tải...</p>
        </div>
      }
    >
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pricing" element={<PricingPage />} />

        {/* Private routes — bọc trong AppLayout */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<PlaceholderPage title="📋 Giao dịch" />} />
            <Route path="/analytics" element={<PlaceholderPage title="📊 Phân tích" />} />
            <Route path="/goals" element={<PlaceholderPage title="🎯 Mục tiêu" />} />
            <Route path="/ai" element={<PlaceholderPage title="🤖 AI Assistant" />} />
            <Route path="/household" element={<PlaceholderPage title="🏠 Đồ dùng" />} />
            <Route path="/settings" element={<PlaceholderPage title="⚙️ Cài đặt" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

        {import.meta.env.DEV && (
          <Route path="/dev" element={<DevKit />} />
        )}
      </Routes>
    </Suspense>
  )
}

export default App