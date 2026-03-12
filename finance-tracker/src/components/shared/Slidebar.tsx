import { LockedBadge } from "./LockedBadge"

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/', plan: null },
    { label: 'Giao dịch', href: '/expenses', plan: null },
    { label: 'Danh mục', href: '/categories', plan: 'PLUS' as const },
    { label: 'Mục tiêu', href: '/goals', plan: 'PLUS' as const },
    { label: 'AI Assistant', href: '/ai', plan: 'PLUS' as const },
    { label: 'Đồ dùng', href: '/household', plan: 'PREMIUM' as const },
]

export const Sidebar = () => (
    <nav>
        {NAV_ITEMS.map(item => (
            <div key={item.href} className="flex items-center justify-between px-3 py-2">
                <span>{item.label}</span>
                {item.plan && <LockedBadge requiredPlan={item.plan} />}
            </div>
        ))}
    </nav>
)