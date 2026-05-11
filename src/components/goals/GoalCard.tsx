import { useState } from 'react'
import { Pencil, Trash2, XCircle, AlertTriangle } from 'lucide-react'
import * as Icons from 'lucide-react'
import { DS } from '@/lib/design-system'
import { GoalProgressBar } from './GoalProgressBar'
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
    const IconComponent = (Icons as any)[toPascalCase(goal.icon)] || Icons.Target
    const config = GOAL_TYPE_CONFIG[goal.type]

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirmDelete) {
            setConfirmDelete(true)
            setTimeout(() => setConfirmDelete(false), 3000)
            return
        }
        deleteMutation.mutate(goal.id)
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        onEdit()
    }

    const handleCancel = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (window.confirm(`Huỷ mục tiêu "${goal.name}"?`)) {
            cancelMutation.mutate(goal.id)
        }
    }

    const isDebtDanger = goal.type === 'DEBT' && goal.overLimit
    const isCompleted = goal.status === 'COMPLETED'
    const isCancelled = goal.status === 'CANCELLED'

    return (
        <div
            className={`
        ${DS.card}
        flex flex-col gap-3
        transition-all hover:shadow-md
        ${onClick ? 'cursor-pointer hover:border-primary-200' : ''}
        ${isDebtDanger ? 'border-danger-300 bg-danger-50/30' : ''}
        ${isCancelled ? 'opacity-60' : ''}
      `}
            onClick={onClick}
        >
            {/* Header row */}
            <div className="flex items-start gap-3">

                {/* Icon */}
                <div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                        backgroundColor: isDebtDanger ? '#fef2f2' : goal.color + '20',
                        color: isDebtDanger ? '#ef4444' : goal.color,
                    }}
                >
                    <IconComponent size={20} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-text-primary truncate">{goal.name}</span>

                        {/* Type badge */}
                        <span className={`
              text-xs px-2 py-0.5 rounded-full font-semibold
              ${config.bgClass} ${config.textClass}
            `}>
                            {config.label}
                        </span>

                        {/* DEBT DANGER badge */}
                        {isDebtDanger && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-danger-100 text-text-primary flex items-center gap-1">
                                <AlertTriangle size={10} /> Vượt hạn mức!
                            </span>
                        )}

                        {/* Completed badge */}
                        {isCompleted && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-success-50 text-text-primary">
                                ✓ Hoàn thành
                            </span>
                        )}
                    </div>

                    {/* Deadline */}
                    {goal.deadline && !isCompleted && (
                        <div className="text-xs text-text-muted mt-0.5">
                            Hạn: {new Date(goal.deadline).toLocaleDateString('vi-VN')}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    {!isCancelled && !isCompleted && (
                        <>
                            <button
                                onClick={handleEdit}
                                className="p-1.5 rounded-md text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors"
                            >
                                <Pencil size={13} />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="p-1.5 rounded-md text-text-muted hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                title="Huỷ mục tiêu"
                            >
                                <XCircle size={13} />
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className={`
              p-1.5 rounded-md transition-all duration-200
              ${confirmDelete
                                ? 'bg-danger-500 text-white scale-110'
                                : 'text-text-muted hover:bg-surface-border hover:text-danger-500'
                            }
            `}
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>

            {/* Progress */}
            {!isCancelled && (
                <GoalProgressBar goal={goal} height={isDebtDanger ? 'lg' : 'md'} />
            )}

            {/* DEBT warning row */}
            {isDebtDanger && (
                <div className="flex items-center gap-2 bg-danger-100 rounded-lg px-3 py-2">
                    <AlertTriangle size={14} className="text-danger-600 flex-shrink-0" />
                    <p className="text-xs text-text-primary font-medium">
                        Nợ đã vượt mục tiêu {formatVND(goal.currentAmount - goal.targetAmount)}.
                        Hãy ưu tiên trả nợ ngay!
                    </p>
                </div>
            )}
        </div>
    )
}