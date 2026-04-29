import { NavLink } from 'react-router-dom'
import { usePlan } from '@/hooks/usePlan'
import {
    LayoutDashboard,
    ArrowLeftRight,
    BarChart2,
    Bot,
    Settings,
    type LucideIcon,
} from 'lucide-react'

// Mobile chỉ hiện 5 item quan trọng nhất
interface BottomNavItem {
    label: string
    href: string
    icon: LucideIcon
    requiredPlan?: 'PLUS' | 'PREMIUM'
}

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
    { label: 'Home', href: '/', icon: LayoutDashboard },
    { label: 'Giao dịch', href: '/expenses', icon: ArrowLeftRight },
    { label: 'Phân tích', href: '/analytics', icon: BarChart2, requiredPlan: 'PLUS' },
    { label: 'AI', href: '/ai', icon: Bot, requiredPlan: 'PLUS' },
    { label: 'Cài đặt', href: '/settings', icon: Settings },
]

export const BottomNav = () => {
    const { hasLevel } = usePlan()

    return (
        <nav className="h-16 bg-surface border-t border-surface-border flex items-center shrink-0">
            {BOTTOM_NAV_ITEMS.map(item => {
                const Icon = item.icon
                const isLocked = item.requiredPlan ? !hasLevel(item.requiredPlan) : false

                return (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        end={item.href === '/'}
                        className={({ isActive }) => `
              flex-1 flex flex-col items-center justify-center gap-0.5 py-2
              text-xs font-medium transition-colors relative
              ${isActive
                                ? 'text-primary-600'
                                : 'text-text-muted hover:text-text-secondary'
                            }
            `}
                    >
                        <div className="relative">
                            <Icon size={22} />
                            {/* Chấm khóa nhỏ */}
                            {isLocked && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />
                            )}
                        </div>
                        <span>{item.label}</span>
                    </NavLink>
                )
            })}
        </nav>
    )
}