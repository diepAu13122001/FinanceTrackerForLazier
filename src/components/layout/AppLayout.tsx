import { Outlet, useLocation } from 'react-router-dom'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { animations } from '@/lib/animations'

// ─── Layout wrapper cho tất cả private routes ─────────────────────────────────
//
// Desktop (md+):
// ┌─────────────────────────────┐
// │         TopBar              │
// ├──────────┬──────────────────┤
// │ Sidebar  │   Page Content   │
// └──────────┴──────────────────┘
//
// Mobile (<md):
// ┌─────────────────────────────┐
// │         TopBar              │
// ├─────────────────────────────┤
// │       Page Content          │
// ├─────────────────────────────┤
// │        BottomNav            │
// └─────────────────────────────┘

export const AppLayout = () => {
    const location = useLocation()
    return (
        <div className="h-screen flex flex-col overflow-hidden">

            <TopBar />

            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar — chỉ hiện trên md+ */}
                <div className="hidden md:block">
                    <Sidebar />
                </div>

                {/* Page content — scroll độc lập */}
                <main className="flex-1 overflow-y-auto bg-surface-muted">
                    <div className={animations.fadeIn} key={location.pathname}>
                        <Outlet />
                    </div>
                </main>

            </div>

            {/* Bottom nav — chỉ hiện trên mobile */}
            <div className="md:hidden">
                <BottomNav />
            </div>

        </div>
    )
}