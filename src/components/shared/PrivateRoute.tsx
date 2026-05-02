import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export const PrivateRoute = () => {
    const token = useAuthStore(s => s.token)
    const user = useAuthStore(s => s.user)
    const logout = useAuthStore(s => s.logout)

    // Có token nhưng đã hết hạn → decode và kiểm tra exp
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const isExpired = payload.exp * 1000 < Date.now()

            if (isExpired) {
                // Token hết hạn → logout ngay lập tức thay vì đợi API call thất bại
                logout()
                return <Navigate to="/login" replace />
            }
        } catch {
            // Token format sai → logout
            logout()
            return <Navigate to="/login" replace />
        }
    }

    if (!token || !user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}