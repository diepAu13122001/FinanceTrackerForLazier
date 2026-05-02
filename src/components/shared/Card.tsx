import { DS } from '@/lib/design-system'
import type { PlanId } from '@/types/plans'

// ─── Types ────────────────────────────────────────────────────────────────────

type CardVariant = 'default' | 'elevated' | 'locked'

interface CardProps {
    variant?: CardVariant
    children: React.ReactNode
    className?: string
    // Chỉ dùng khi variant="locked"
    requiredPlan?: Exclude<PlanId, 'FREE'>
    onUpgrade?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Card = ({
    variant = 'default',
    children,
    className = '',
    requiredPlan,
    onUpgrade,
}: CardProps) => {

    const baseClass = variant === 'elevated'
        ? DS.cardMuted + ' shadow-md'
        : DS.card

    // Variant locked: hiển thị nội dung bị làm mờ + overlay
    if (variant === 'locked') {
        return (
            <div className={`${DS.card} relative overflow-hidden ${className}`}>

                {/* Nội dung bị làm mờ phía sau */}
                <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
                    {children}
                </div>

                {/* Overlay khóa */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] p-6 text-center">
                    <span className="text-3xl mb-2">🔒</span>
                    <p className="text-sm font-semibold text-text-primary mb-1">
                        Tính năng này cần gói{' '}
                        <span className={requiredPlan === 'PREMIUM' ? 'text-amber-600' : 'text-primary-600'}>
                            {requiredPlan === 'PREMIUM' ? '💎 Premium' : '⭐ Plus'}
                        </span>
                    </p>
                    <p className={`${DS.muted} mb-4`}>
                        {requiredPlan === 'PREMIUM'
                            ? 'Nâng cấp để mở khóa tính năng cao cấp này'
                            : 'Nâng cấp miễn phí để dùng tính năng này'}
                    </p>
                    {onUpgrade && (
                        <button
                            onClick={onUpgrade}
                            className={DS.btnPremium}
                        >
                            Nâng cấp ngay
                        </button>
                    )}
                </div>

            </div>
        )
    }

    // Variant default và elevated
    return (
        <div className={`${baseClass} ${className}`}>
            {children}
        </div>
    )
}