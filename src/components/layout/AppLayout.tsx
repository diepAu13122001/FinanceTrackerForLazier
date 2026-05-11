import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { animations } from '@/lib/animations'

// Pages không có trong BottomNav → hiện back button trên mobile
const HIDDEN_PAGES: Record<string, string> = {
    '/categories': 'Danh mục',
    '/settings': 'Cài đặt',
    '/expenses': 'Giao dịch',
    '/pricing': 'Nâng cấp',
}

export const AppLayout = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const hiddenPageTitle = HIDDEN_PAGES[location.pathname]
    const isHiddenPage = !!hiddenPageTitle

    return (
        <div className="h-screen flex flex-col overflow-hidden">

            {/* TopBar — desktop */}
            <div className="hidden md:block">
                <TopBar />
            </div>

            {/* Mobile header — back button cho hidden pages */}
            <div className="md:hidden">
                {isHiddenPage ? (
                    /* Hidden page: hiện back + title */
                    <div className="
                        h-14 bg-surface border-b border-surface-border
                        flex items-center px-4 gap-3
                        shrink-0
                    ">
                        <button
                            onClick={() => navigate('/')}
                            className="
                                flex items-center gap-1
                                text-primary-600 font-medium text-sm
                                hover:text-primary-700 transition-colors
                            "
                            aria-label="Về trang chính"
                        >
                            <ChevronLeft size={20} />
                            <span>Home</span>
                        </button>
                        <span className="flex-1 text-center font-semibold text-text-primary pr-12">
                            {hiddenPageTitle}
                        </span>
                    </div>
                ) : (
                    /* Main nav pages: hiện TopBar bình thường */
                    <TopBar />
                )}
            </div>

            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar — chỉ hiện trên md+ */}
                <div className="hidden md:block">
                    <Sidebar />
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-surface-muted">
                    <div className={animations.fadeIn} key={location.pathname}>
                        <Outlet />
                    </div>
                </main>

            </div>

            {/* BottomNav — chỉ hiện trên mobile + ẩn khi ở hidden pages */}
            {!isHiddenPage && (
                <div className="md:hidden">
                    <BottomNav />
                </div>
            )}

        </div>
    )
}