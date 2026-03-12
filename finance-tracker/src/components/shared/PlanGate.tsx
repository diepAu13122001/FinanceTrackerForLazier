import { usePlan } from '@/hooks/usePlan'
import { UpgradePrompt } from './UpgradePrompt'
import type { PlanId } from '@/types/plans'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlanGateProps {
    requires: Exclude<PlanId, 'FREE'>
    children: React.ReactNode
    // Nếu truyền fallback → dùng fallback tùy chỉnh thay vì UpgradePrompt mặc định
    fallback?: React.ReactNode
    // Layout của UpgradePrompt khi không có fallback tùy chỉnh
    promptLayout?: 'card' | 'inline'
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PlanGate = ({
    requires,
    children,
    fallback,
    promptLayout = 'card',
}: PlanGateProps) => {
    const { hasLevel } = usePlan()

    // Đủ quyền → render bình thường
    if (hasLevel(requires)) {
        return <>{children}</>
    }

    // Không đủ quyền → render fallback tùy chỉnh hoặc UpgradePrompt mặc định
    if (fallback) {
        return <>{fallback}</>
    }

    return (
        <UpgradePrompt
            requiredPlan={requires}
            layout={promptLayout}
        />
    )
}