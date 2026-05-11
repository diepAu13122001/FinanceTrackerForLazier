import { useMemo } from 'react'
import { Calculator, TrendingUp, AlertTriangle } from 'lucide-react'
import { DS } from '@/lib/design-system'
import { formatVND } from '@/utils/format'
import type { GoalResponse } from '@/types/goal'
import { GOAL_TYPE_CONFIG } from '@/types/goal'
import { useTransactionSummary } from '@/hooks/useTransactions'

interface FreedomNumberCalculatorProps {
    goals: GoalResponse[]
}

export const FreedomNumberCalculator = ({ goals }: FreedomNumberCalculatorProps) => {
    const now = new Date()
    const year = now.getFullYear()

    // Lấy 3 tháng gần nhất để tính trung bình
    const m1 = useTransactionSummary({ year, month: now.getMonth() + 1 })
    const m2 = useTransactionSummary({ year, month: now.getMonth() || 12 })
    const m3 = useTransactionSummary({ year, month: now.getMonth() === 0 ? 11 : now.getMonth() - 1 || 12 })

    // Tính average monthly net savings
    const avgMonthlySavings = useMemo(() => {
        const months = [m1.data, m2.data, m3.data].filter(Boolean)
        if (!months.length) return 0
        const total = months.reduce((sum, m) => sum + ((m!.totalIncome ?? 0) - (m!.totalExpense ?? 0)), 0)
        return total / months.length
    }, [m1.data, m2.data, m3.data])

    const activeGoals = goals.filter(g => g.status === 'ACTIVE')

    if (!activeGoals.length) return null

    return (
        <div className={DS.card}>
            <div className="flex items-center gap-2 mb-4">
                <Calculator size={18} className="text-primary-600" />
                <h3 className={DS.heading3}>Freedom Number Calculator</h3>
            </div>

            {/* Monthly savings info */}
            <div className={`rounded-lg p-3 mb-4 ${avgMonthlySavings > 0
                    ? 'bg-success-50 border border-success-200'
                    : 'bg-danger-50 border border-danger-200'
                }`}>
                <div className="flex items-center gap-2">
                    <TrendingUp size={14} className={avgMonthlySavings > 0 ? 'text-success-600' : 'text-danger-600'} />
                    <span className="text-sm font-semibold text-text-primary">
                        Tiết kiệm trung bình:{' '}
                        <span className={avgMonthlySavings > 0 ? 'text-success-600' : 'text-danger-600'}>
                            {avgMonthlySavings > 0 ? '+' : ''}{formatVND(Math.round(avgMonthlySavings))}/tháng
                        </span>
                    </span>
                </div>
                <p className="text-xs text-text-muted mt-1">Dựa trên 3 tháng gần nhất</p>
            </div>

            {/* Goal estimates */}
            <div className="flex flex-col gap-3">
                {activeGoals.map(goal => {
                    const config = GOAL_TYPE_CONFIG[goal.type]
                    const remaining = goal.remainingAmount

                    let estimateText: string
                    let estimateColor: string
                    let urgencyIcon: React.ReactNode = null

                    if (goal.type === 'DEBT' && goal.overLimit) {
                        estimateText = '⚠ Vượt hạn mức! Cần trả ngay'
                        estimateColor = 'text-danger-800'
                        urgencyIcon = <AlertTriangle size={14} className="text-danger-500" />
                    } else if (remaining <= 0) {
                        estimateText = '✓ Đã đạt mục tiêu'
                        estimateColor = 'text-success-800'
                    } else if (avgMonthlySavings <= 0) {
                        estimateText = 'Cần tăng thu nhập hoặc giảm chi tiêu'
                        estimateColor = 'text-amber-800'
                    } else {
                        const months = Math.ceil(remaining / avgMonthlySavings)
                        const now2 = new Date()
                        now2.setMonth(now2.getMonth() + months)
                        const estimateDate = now2.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
                        estimateText = months <= 1
                            ? 'Có thể đạt trong tháng này!'
                            : `~${months} tháng nữa (${estimateDate})`
                        estimateColor = months <= 3 ? 'text-success-600' : months <= 12 ? 'text-amber-600' : 'text-text-primary'

                        // Deadline warning
                        if (goal.deadline) {
                            const deadlineDate = new Date(goal.deadline)
                            const monthsToDeadline = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))
                            if (months > monthsToDeadline) {
                                estimateText = `Cần tăng tiết kiệm — deadline ${goal.deadline}`
                                estimateColor = 'text-danger-600'
                                urgencyIcon = <AlertTriangle size={14} className="text-danger-500" />
                            }
                        }
                    }

                    return (
                        <div
                            key={goal.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border ${goal.type === 'DEBT' && goal.overLimit
                                    ? 'border-danger-200 bg-danger-50/40'
                                    : 'border-surface-border'
                                }`}
                        >
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: goal.color + '20', color: goal.color }}>
                                {urgencyIcon || <span className="text-xs font-bold">{config.label[0]}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold truncate text-text-primary">{goal.name}</div>
                                <div className={`text-xs ${estimateColor} font-medium mt-0.5`}>
                                    {estimateText}
                                </div>
                                {remaining > 0 && avgMonthlySavings > 0 && (
                                    <div className="text-xs text-text-muted mt-0.5">
                                        Còn {formatVND(remaining)} · tiết kiệm {formatVND(Math.round(avgMonthlySavings))}/tháng
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}