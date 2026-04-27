import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

// ─── PrivateRoute — bảo vệ các trang cần đăng nhập ───────────────────────────
// Dùng như một wrapper trong App.tsx:
// <Route element={<PrivateRoute />}>
//   <Route path="/dashboard" element={<Dashboard />} />
// </Route>

export const PrivateRoute = () => {
    const isLoggedIn = useAuthStore(s => s.isLoggedIn())

    // Chưa đăng nhập → redirect về login
    // `replace` để không lưu vào history — nhấn Back không quay lại được trang bị chặn
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }

    // Đã đăng nhập → render route con
    return <Outlet />
}