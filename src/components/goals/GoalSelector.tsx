import { useState } from 'react'
import { ChevronDown, Target } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useActiveGoals } from '@/hooks/useGoals'
import { DS } from '@/lib/design-system'
import { GOAL_TYPE_CONFIG } from '@/types/goal'
import { formatVND } from '@/utils/format'
import { Link } from 'react-router-dom'

const toPascalCase = (s: string) =>
    s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')

interface GoalSelectorProps {
    value: string | null
    onChange: (goalId: string | null) => void
    label?: string
}

export const GoalSelector = ({
    value,
    onChange,
    label = 'Mục tiêu',
}: GoalSelectorProps) => {

    const [open, setOpen] = useState(false)
    const { data: goals, isLoading } = useActiveGoals()
    const selected = goals?.find(g => g.id === value) ?? null

    return (
        <div className="relative">
            <label className={DS.label}>{label}</label>

            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`${DS.inputBase} flex items-center justify-between cursor-pointer mt-1`}
            >
                {selected ? (
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: selected.color }} />
                        <span className="text-sm">{selected.name}</span>
                        <span className={`
              text-xs px-1.5 py-0.5 rounded-full
              ${GOAL_TYPE_CONFIG[selected.type].bgClass}
              ${GOAL_TYPE_CONFIG[selected.type].textClass}
            `}>
                            {GOAL_TYPE_CONFIG[selected.type].label}
                        </span>
                    </div>
                ) : (
                    <span className="text-text-muted text-sm">Liên kết mục tiêu (tùy chọn)</span>
                )}
                <ChevronDown size={16} className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
                    <div className="absolute z-40 mt-1 w-full bg-white rounded-lg shadow-lg border border-surface-border max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">

                        <button
                            type="button"
                            onClick={() => { onChange(null); setOpen(false) }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted transition-colors"
                        >
                            <span className="text-text-muted italic">Không liên kết</span>
                        </button>

                        {isLoading && (
                            <div className="px-3 py-3 text-sm text-text-muted">Đang tải...</div>
                        )}

                        {!isLoading && goals?.map(goal => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const IconComp = (Icons as any)[toPascalCase(goal.icon)] || Icons.Target
                            const config = GOAL_TYPE_CONFIG[goal.type]

                            return (
                                <button
                                    key={goal.id}
                                    type="button"
                                    onClick={() => { onChange(goal.id); setOpen(false) }}
                                    className={`
                    w-full px-3 py-2.5 text-left
                    hover:bg-surface-muted transition-colors
                    flex items-center gap-3
                    ${value === goal.id ? 'bg-surface-muted' : ''}
                  `}
                                >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: goal.color + '20', color: goal.color }}>
                                        <IconComp size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-medium text-text-primary truncate">{goal.name}</span>
                                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${config.bgClass} ${config.textClass}`}>
                                                {config.label}
                                            </span>
                                        </div>
                                        {/* Progress mini */}
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-1 bg-surface-muted rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{
                                                    width: `${Math.min(goal.progressPercent, 100)}%`,
                                                    backgroundColor: goal.color,
                                                }} />
                                            </div>
                                            <span className="text-xs text-text-muted flex-shrink-0">
                                                {formatVND(goal.remainingAmount)} còn lại
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}

                        {!isLoading && (!goals || goals.length === 0) && (
                            <Link
                                to="/goals"
                                className="block px-3 py-3 text-sm text-primary-600 hover:bg-primary-50 transition-colors border-t border-surface-border"
                                onClick={() => setOpen(false)}
                            >
                                + Tạo mục tiêu đầu tiên
                            </Link>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}