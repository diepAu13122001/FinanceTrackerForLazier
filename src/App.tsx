import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DS } from '@/lib/design-system'
import { PrivateRoute } from '@/components/shared/PrivateRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { Toaster } from 'react-hot-toast'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const PricingPage = lazy(() => import('@/pages/PricingPage'))
const DevKit = lazy(() => import('@/pages/DevKit'))
const ExpensesPage = lazy(() => import('@/pages/ExpensesPage'))
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'))
const SettingPsage = lazy(() => import('@/pages/SettingsPage'))
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'))


// Placeholder pages — sẽ xây dựng ở các ngày tiếp theo
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8">
    <h1 className={DS.heading1}>{title}</h1>
    <p className={DS.muted}>Trang này sẽ được xây dựng sớm.</p>
  </div>
)

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            animation: 'toastEnter 0.3s ease forwards',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
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
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/goals" element={<PlaceholderPage title="🎯 Mục tiêu" />} />
              <Route path="/ai" element={<PlaceholderPage title="🤖 AI Assistant" />} />
              <Route path="/household" element={<PlaceholderPage title="🏠 Đồ dùng" />} />
              <Route path="/settings" element={<SettingPsage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />

          {import.meta.env.DEV && (
            <Route path="/dev" element={<DevKit />} />
          )}
        </Routes>
      </Suspense>

    </>

  )
}

export default App