import { DS } from '@/lib/design-system'
import { Lock } from 'lucide-react'
import type { PlanId } from '@/types/plans'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LockedBadgeProps {
    requiredPlan: Exclude<PlanId, 'FREE'>
}

// ─── Component ────────────────────────────────────────────────────────────────

export const LockedBadge = ({ requiredPlan }: LockedBadgeProps) => {
    const isPremium = requiredPlan === 'PREMIUM'

    return (
        <span className={`
      ${DS.badge}
      ${isPremium
                ? `${DS.badgePremium} gap-0.5`
                : 'bg-primary-50 text-primary-700 gap-0.5'
            }
    `}>
            <Lock size={10} />
            {isPremium ? 'Premium' : 'Plus'}
        </span>
    )
}