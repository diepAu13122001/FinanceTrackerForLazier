import type { GoalResponse } from '@/types/goal'
import { GOAL_TYPE_CONFIG } from '@/types/goal'
import { formatVND } from '@/utils/format'

interface GoalProgressBarProps {
    goal: GoalResponse
    showText?: boolean
    height?: 'sm' | 'md' | 'lg'
}

export const GoalProgressBar = ({
    goal,
    showText = true,
    height = 'md',
}: GoalProgressBarProps) => {

    const config = GOAL_TYPE_CONFIG[goal.type]
    const pct = Math.min(goal.progressPercent, 100)

    const heightMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

    // Màu bar: DEBT over limit → danger pulse
    const barColor = goal.overLimit
        ? '#ef4444'
        : goal.status === 'COMPLETED'
            ? '#22c55e'
            : config.color

    return (
        <div className="w-full">
            {/* Bar track */}
            <div className={`w-full ${heightMap[height]} bg-surface-muted rounded-full overflow-hidden`}>
                <div
                    className={`h-full rounded-full transition-all duration-700 ${goal.overLimit ? 'animate-pulse' : ''}`}
                    style={{
                        width: `${pct}%`,
                        backgroundColor: barColor,
                    }}
                />
            </div>

            {/* Text below */}
            {showText && (
                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-text-muted">
                        {formatVND(goal.currentAmount)} / {formatVND(goal.targetAmount)}
                    </span>
                    <span
                        className={`text-xs font-bold ${goal.overLimit ? 'text-danger-600' : ''}`}
                        style={{ color: goal.overLimit ? undefined : barColor }}
                    >
                        {goal.overLimit
                            ? `⚠ Vượt ${formatVND(goal.currentAmount - goal.targetAmount)}`
                            : `${pct.toFixed(0)}%`}
                    </span>
                </div>
            )}
        </div>
    )
}