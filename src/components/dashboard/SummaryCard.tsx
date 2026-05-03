import { animations } from '@/lib/animations'
import { DS } from '@/lib/design-system'
import type { LucideIcon } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import { formatVND } from '@/utils/format'

interface SummaryCardProps {
    label: string
    value: string
    rawAmount?: number
    icon: LucideIcon
    trend?: number
    colorClass: string
    loading?: boolean
}

export const SummaryCard = ({
    label,
    value,
    rawAmount,
    icon: Icon,
    colorClass,
    loading = false,
}: SummaryCardProps) => {

    const animatedAmount = useCountUp(rawAmount ?? 0)

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

            <p className={`text-xl font-bold ${colorClass}`}>
                {rawAmount !== undefined
                    ? formatVND(animatedAmount)
                    : value}
            </p>
        </div>
    )
}