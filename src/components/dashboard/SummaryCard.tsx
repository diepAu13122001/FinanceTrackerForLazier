import { animations } from '@/lib/animations'
import { DS } from '@/lib/design-system'
import type { LucideIcon } from 'lucide-react'

interface SummaryCardProps {
    label: string
    value: string
    icon: LucideIcon
    trend?: number      // % thay đổi so với kỳ trước — tính năng sau
    colorClass: string      // màu của value
    loading?: boolean
}

export const SummaryCard = ({
    label,
    value,
    icon: Icon,
    colorClass,
    loading = false,
}: SummaryCardProps) => {
    if (loading) {
        return (
            <div className={DS.card}>
                <div className="h-4 w-20 bg-surface-muted rounded animate-pulse mb-3" />
                <div className="h-7 w-32 bg-surface-muted rounded animate-pulse" />
            </div>
        )
    }

    return (
        <div className={`
            ${DS.card}
            ${animations.fadeInUp}
            transition-shadow hover:shadow-md
            `}>
            <div className="flex items-center justify-between mb-3">
                <p className={DS.muted}>{label}</p>
                <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center">
                    <Icon size={16} className="text-text-muted" />
                </div>
            </div>
            <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
        </div>
    )
}