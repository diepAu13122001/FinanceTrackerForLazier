import { useState } from 'react'
import { Pencil, Trash2, XCircle, AlertTriangle, Calendar } from 'lucide-react'
import * as Icons from 'lucide-react'
import { DS } from '@/lib/design-system'
import { useCancelGoal, useDeleteGoal } from '@/hooks/useGoals'
import { GOAL_TYPE_CONFIG } from '@/types/goal'
import type { GoalResponse } from '@/types/goal'
import { formatVND } from '@/utils/format'

const toPascalCase = (s: string) =>
    s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')

interface GoalCardProps {
    goal: GoalResponse
    onEdit: () => void
    onClick?: () => void
}

export const GoalCard = ({ goal, onEdit, onClick }: GoalCardProps) => {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const cancelMutation = useCancelGoal()
    const deleteMutation = useDeleteGoal()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[toPascalCase(goal.icon)] || Icons.Wallet
    const config = GOAL_TYPE_CONFIG[goal.type]
    const isDebtDanger = goal.type === 'DEBT' && goal.overLimit
    const isCompleted = goal.status === 'COMPLETED'
    const isCancelled = goal.status === 'CANCELLED'
    const isInstallment = goal.type === 'DEBT' && goal.subtype === 'INSTALLMENT'

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return }
        deleteMutation.mutate(goal.id)
    }

    return (
        <div
            className={`
                ${DS.card} flex flex-col gap-3 transition-all hover:shadow-md
                ${onClick ? 'cursor-pointer hover:border-primary-200' : ''}
                ${isDebtDanger ? 'border-danger-300 bg-danger-50/30' : ''}
                ${isCancelled ? 'opacity-60' : ''}
            `}
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                        backgroundColor: isDebtDanger ? '#fef2f2' : goal.color + '20',
                        color: isDebtDanger ? '#ef4444' : goal.color,
                    }}>
                    <IconComponent size={20} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-text-primary truncate">{goal.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${config.bgClass}`}
                            style={{ color: config.color }}>
                            {config.label}
                            {isInstallment && ' · Trả góp'}
                        </span>
                        {isDebtDanger && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-danger-100 text-danger-700 flex items-center gap-1">
                                <AlertTriangle size={10} /> Vượt hạn mức!
                            </span>
                        )}
                        {isCompleted && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-success-50 text-success-700">
                                ✓ Hoàn thành
                            </span>
                        )}
                    </div>
                    {goal.deadline && !isCompleted && (
                        <div className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                            <Calendar size={10} />
                            {isInstallment ? 'Tất toán:' : 'Hạn:'} {new Date(goal.deadline).toLocaleDateString('vi-VN')}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                    {!isCancelled && !isCompleted && (
                        <>
                            <button onClick={e => { e.stopPropagation(); onEdit() }}
                                className="p-1.5 rounded-md text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors">
                                <Pencil size={13} />
                            </button>
                            <button onClick={e => { e.stopPropagation(); if (window.confirm(`Huỷ "${goal.name}"?`)) cancelMutation.mutate(goal.id) }}
                                className="p-1.5 rounded-md text-text-muted hover:bg-amber-50 hover:text-amber-600 transition-colors">
                                <XCircle size={13} />
                            </button>
                        </>
                    )}
                    <button onClick={handleDelete} disabled={deleteMutation.isPending}
                        className={`p-1.5 rounded-md transition-all ${confirmDelete ? 'bg-danger-500 text-white scale-110' : 'text-text-muted hover:text-danger-500'}`}>
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>

            {/* Body — khác nhau theo type */}
            {!isCancelled && (
                <>
                    {/* NORMAL wallet */}
                    {goal.type === 'NORMAL' && (
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-text-muted">Số dư hiện tại</span>
                            <span className={`text-base font-bold ${goal.balance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                                {goal.balance < 0 ? '−' : ''}{formatVND(Math.abs(goal.balance))}
                            </span>
                        </div>
                    )}

                    {/* SAVINGS / INVESTMENT */}
                    {(goal.type === 'SAVINGS' || goal.type === 'INVESTMENT') && (
                        <>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-text-muted">
                                    {formatVND(goal.currentAmount)} / {formatVND(goal.targetAmount)}
                                </span>
                                <span className="font-bold" style={{ color: goal.color }}>
                                    {goal.progressPercent.toFixed(0)}%
                                </span>
                            </div>
                            <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.min(goal.progressPercent, 100)}%`,
                                        backgroundColor: goal.color,
                                    }} />
                            </div>
                            {goal.targetAmount > 0 && (
                                <div className="text-xs text-text-muted">
                                    Còn {formatVND(goal.remainingAmount)} nữa
                                </div>
                            )}
                        </>
                    )}

                    {/* DEBT CREDIT_CARD */}
                    {goal.type === 'DEBT' && !isInstallment && (
                        <>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-text-muted">
                                    Đã dùng: {formatVND(goal.currentAmount)}
                                    {goal.creditLimit ? ` / ${formatVND(goal.creditLimit)}` : ''}
                                </span>
                                <span className={`font-bold ${isDebtDanger ? 'text-danger-600' : ''}`}
                                    style={!isDebtDanger ? { color: goal.color } : undefined}>
                                    {goal.progressPercent.toFixed(0)}%
                                </span>
                            </div>
                            <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.min(goal.progressPercent, 100)}%`,
                                        backgroundColor: isDebtDanger ? '#ef4444' : goal.color,
                                    }} />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-text-muted">
                                    Còn: {formatVND(goal.remainingAmount)}
                                </span>
                                {goal.billingDate && (
                                    <span className="text-text-muted">
                                        Đáo hạn ngày {goal.billingDate} hàng tháng
                                    </span>
                                )}
                            </div>
                            {isDebtDanger && (
                                <div className="flex items-center gap-2 bg-danger-100 rounded-lg px-3 py-2">
                                    <AlertTriangle size={14} className="text-danger-600 flex-shrink-0" />
                                    <p className="text-xs text-danger-700 font-medium">
                                        Vượt hạn mức {formatVND(goal.currentAmount - (goal.creditLimit ?? 0))}!
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* DEBT INSTALLMENT — progress theo kỳ */}
                    {goal.type === 'DEBT' && isInstallment && (
                        <>
                            {/* Kỳ progress */}
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-text-muted">Số kỳ đã trả</span>
                                <span className="font-bold text-sm" style={{ color: goal.color }}>
                                    {goal.currentPeriod ?? 0} / {goal.numberOfPeriods ?? '?'} kỳ
                                </span>
                            </div>
                            <div className="h-2.5 bg-surface-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.min(goal.progressPercent, 100)}%`,
                                        backgroundColor: goal.color,
                                    }} />
                            </div>
                            {/* Info row */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-surface-muted rounded-lg px-2 py-1.5">
                                    <div className="text-text-muted">Mỗi kỳ</div>
                                    <div className="font-bold">
                                        {goal.monthlyPayment ? formatVND(goal.monthlyPayment) : '—'}
                                    </div>
                                </div>
                                <div className="bg-surface-muted rounded-lg px-2 py-1.5">
                                    <div className="text-text-muted">Còn phải trả</div>
                                    <div className="font-bold text-danger-600">
                                        {goal.remainingPeriods !== null && goal.monthlyPayment
                                            ? formatVND((goal.remainingPeriods ?? 0) * goal.monthlyPayment)
                                            : '—'}
                                    </div>
                                </div>
                            </div>
                            {goal.initialAmount && (
                                <div className="text-xs text-text-muted">
                                    Vay ban đầu: {formatVND(goal.initialAmount)} · Còn {goal.remainingPeriods} kỳ
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    )
}