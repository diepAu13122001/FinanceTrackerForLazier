import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DS } from '@/lib/design-system'
import { PrivateRoute } from '@/components/shared/PrivateRoute'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const DevKit = lazy(() => import('@/pages/DevKit'))
const PricingPage = lazy(() => import('@/pages/PricingPage'))


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

        {/* Public routes — không cần đăng nhập */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pricing" element={<PricingPage />} />

        {/* Private routes — cần đăng nhập */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={
            <div className="p-8">
              <h1 className={DS.heading1}>🏠 Dashboard</h1>
              <p className={DS.muted}>Tuần 3 sẽ xây dựng trang này</p>
            </div>
          } />
        </Route>

        {/* Redirect các route không tồn tại về home */}
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* Dev only */}
        {import.meta.env.DEV && (
          <Route path="/dev" element={<DevKit />} />
        )}

      </Routes>
    </Suspense>
  )
}

export default App