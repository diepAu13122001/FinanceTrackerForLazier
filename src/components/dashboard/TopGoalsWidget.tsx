import { useNavigate } from 'react-router-dom'
import { Target, ChevronRight } from 'lucide-react'
import { DS } from '@/lib/design-system'
import { GoalProgressBar } from '@/components/goals/GoalProgressBar'
import { useActiveGoals } from '@/hooks/useGoals'
import { usePlan } from '@/hooks/usePlan'
import { GOAL_TYPE_CONFIG } from '@/types/goal'
import { UpgradePrompt } from '@/components/shared/UpgradePrompt'
import { Skeleton } from '@/components/shared/Skeleton'

export const TopGoalsWidget = () => {
    const navigate = useNavigate()
    const { isPlus } = usePlan()
    const { data: goals, isLoading } = useActiveGoals()

    if (!isPlus) {
        return (
            <div className={DS.card}>
                <div className="flex items-center gap-2 mb-3">
                    <Target size={18} className="text-primary-600" />
                    <h2 className={DS.heading3}>Mục tiêu tài chính</h2>
                </div>
                <UpgradePrompt
                    title="Theo dõi mục tiêu tài chính"
                    requiredPlan="PLUS"
                    layout="inline"
                />
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className={DS.card}>
                <Skeleton className="h-5 w-40 mb-3" />
                {[1, 2].map(i => <Skeleton key={i} className="h-16 rounded-xl mb-2" />)}
            </div>
        )
    }

    const topGoals = goals?.slice(0, 3) ?? []

    return (
        <div className={DS.card}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Target size={18} className="text-primary-600" />
                    <h2 className={DS.heading3}>Mục tiêu tài chính</h2>
                </div>
                <button
                    onClick={() => navigate('/goals')}
                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-0.5"
                >
                    Xem tất cả <ChevronRight size={12} />
                </button>
            </div>

            {topGoals.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-sm text-text-muted mb-2">Chưa có mục tiêu nào</p>
                    <button
                        onClick={() => navigate('/goals')}
                        className="text-sm text-primary-600 hover:underline"
                    >
                        Tạo mục tiêu đầu tiên →
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {topGoals.map(goal => {
                        const config = GOAL_TYPE_CONFIG[goal.type]
                        return (
                            <div
                                key={goal.id}
                                className={`rounded-xl p-3 cursor-pointer hover:opacity-80 transition-opacity
                  ${goal.type === 'DEBT' && goal.overLimit ? 'bg-danger-50 border border-danger-200' : 'bg-surface-muted'}
                `}
                                onClick={() => navigate('/goals')}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold truncate">{goal.name}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${config.bgClass} ${config.textClass}`}>
                                            {config.label}
                                        </span>
                                        {goal.overLimit && (
                                            <span className="text-xs text-danger-600 font-bold">⚠</span>
                                        )}
                                    </div>
                                </div>
                                <GoalProgressBar goal={goal} height="sm" />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}