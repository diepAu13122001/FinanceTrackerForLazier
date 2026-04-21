import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { DS } from '@/lib/design-system'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const DevKit = lazy(() => import('@/pages/DevKit'))

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
        <Route path="/" element={<div className="p-8"><h1 className={DS.heading1}>Home</h1></div>} />
        <Route path="/login" element={<LoginPage />} />

        {import.meta.env.DEV && (
          <Route path="/dev" element={<DevKit />} />
        )}
      </Routes>
    </Suspense>
  )
}

export default App