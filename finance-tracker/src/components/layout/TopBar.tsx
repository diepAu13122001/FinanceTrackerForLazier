import { DS } from '@/lib/design-system'
import { usePlan } from '@/hooks/usePlan'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { LogOut, Settings } from 'lucide-react'

// ─── Plan badge màu theo gói ──────────────────────────────────────────────────

const PlanBadge = () => {
    const { plan, isFree, isPremium } = usePlan()

    const config = isFree
        ? { label: 'Free', className: `${DS.badge} bg-surface-border text-text-muted` }
        : isPremium
            ? { label: '💎 Premium', className: `${DS.badge} ${DS.badgePremium}` }
            : { label: '⭐ Plus', className: `${DS.badge} ${DS.badgePrimary}` }

    return <span className={config.className}>{config.label}</span>
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TopBar = () => {
    const navigate = useNavigate()
    const user = useAuthStore(s => s.user)
    const logout = useAuthStore(s => s.logout)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="h-14 bg-surface border-b border-surface-border flex items-center justify-between px-4 shrink-0">

            {/* Logo */}
            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate('/')}
            >
                <span className="text-xl">💰</span>
                <span className={`${DS.heading3} hidden sm:block`}>Finance Tracker</span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                <PlanBadge />

                <span className={`${DS.muted} hidden sm:block`}>
                    {user?.firstName}
                </span>

                <button
                    onClick={() => navigate('/settings')}
                    className="p-2 rounded-lg hover:bg-surface-muted text-text-muted hover:text-text-primary transition-colors"
                >
                    <Settings size={18} />
                </button>

                <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-surface-muted text-text-muted hover:text-danger-500 transition-colors"
                >
                    <LogOut size={18} />
                </button>
            </div>

        </header>
    )
}