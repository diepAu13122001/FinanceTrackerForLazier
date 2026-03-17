import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { DS } from '@/lib/design-system'

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

        {/* Chỉ hiện trong development — ẩn hoàn toàn khi build production */}
        {import.meta.env.DEV && (
          <Route path="/dev" chore: DevKit preview pageelement={<DevKit />} />
        )}
      </Routes>
    </Suspense>
  )
}

export default App;