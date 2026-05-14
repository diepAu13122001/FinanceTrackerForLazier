import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { DS } from '@/lib/design-system'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalFormModal } from '@/components/goals/GoalFormModal'
import { FreedomNumberCalculator } from '@/components/goals/FreedomNumberCalculator'
import { animations } from '@/lib/animations'
import { useGoals } from '@/hooks/useGoals'
import { GOAL_TYPE_CONFIG } from '@/types/goal'
import type { GoalResponse, GoalType, GoalStatus } from '@/types/goal'
import { Skeleton } from '@/components/shared/Skeleton'
import { formatVND } from '@/utils/format'
import { usePlan } from '@/hooks/usePlan'
import { UpgradePrompt } from '@/components/shared'

type FilterStatus = 'ACTIVE' | 'ALL' | 'COMPLETED' | 'CANCELLED'

const GoalsPage = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<GoalResponse | null>(null)
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('ACTIVE')
    const { isPlus } = usePlan()
    const { data: allGoals, isLoading } = useGoals(isPlus)

    const openCreate = () => { setEditing(null); setModalOpen(true) }
    const openEdit = (g: GoalResponse) => { setEditing(g); setModalOpen(true) }

    // Filter by status
    const goals = allGoals?.filter(g =>
        filterStatus === 'ALL' ? true : g.status === filterStatus
    ) ?? []

    // Group theo type — DEBT lên đầu nếu có overLimit
    const debtGoals = goals.filter(g => g.type === 'DEBT')
    const savingsGoals = goals.filter(g => g.type === 'SAVINGS')
    const investGoals = goals.filter(g => g.type === 'INVESTMENT')

    // Stats (chỉ tính ACTIVE)
    const activeGoals = allGoals?.filter(g => g.status === 'ACTIVE') ?? []
    const totalTarget = activeGoals.reduce((s, g) => s + g.targetAmount, 0)
    const totalCurrent = activeGoals.reduce((s, g) => s + g.currentAmount, 0)
    const overLimitDebts = activeGoals.filter(g => g.overLimit).length
    const overallPct = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0
    if (!isPlus) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <h1 className={DS.heading1}>Nguồn tiền & Mục tiêu</h1>
                <div className="mt-6">
                    <UpgradePrompt
                        requiredPlan="PLUS"
                        layout="card"
                    />
                </div>
            </div>
        )
    }
    return (
        <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">

            {/* Header */}
            <div className={`flex items-center justify-between ${animations.fadeInUp}`}>
                <div>
                    <h1 className={DS.heading1}>Mục tiêu tài chính</h1>
                    <p className={DS.muted}>Đặt mục tiêu — bỏ tiền vào đúng hũ</p>
                </div>
                <div className="hidden md:block">
                    <Button leftIcon={<Plus size={16} />} onClick={openCreate}>Thêm mục tiêu</Button>
                </div>
            </div>

            {/* DEBT DANGER Banner — hiện khi có nợ vượt hạn */}
            {overLimitDebts > 0 && (
                <div className="bg-danger-50 border-2 border-danger-300 rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="text-sm font-bold text-danger-700">
                            {overLimitDebts} khoản nợ vượt hạn mức!
                        </p>
                        <p className="text-xs text-danger-600 mt-0.5">
                            Hãy ưu tiên trả nợ ngay để kiểm soát tài chính.
                        </p>
                    </div>
                </div>
            )}

            {/* Summary stats */}
            {!isLoading && activeGoals.length > 0 && (
                <div className={DS.card}>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-lg font-bold text-text-primary">{activeGoals.length}</div>
                            <div className="text-xs text-text-muted">Mục tiêu đang theo dõi</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-primary-600">{overallPct.toFixed(0)}%</div>
                            <div className="text-xs text-text-muted">Tiến độ trung bình</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-text-primary">{formatVND(totalTarget - totalCurrent)}</div>
                            <div className="text-xs text-text-muted">Còn cần tích lũy</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter tabs */}
            <div className="flex gap-1 p-1 bg-surface-muted rounded-lg w-fit">
                {([
                    { key: 'ACTIVE', label: 'Đang thực hiện' },
                    { key: 'ALL', label: 'Tất cả' },
                    { key: 'COMPLETED', label: 'Hoàn thành' },
                    { key: 'CANCELLED', label: 'Đã huỷ' },
                ] as { key: FilterStatus; label: string }[]).map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilterStatus(tab.key)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all
              ${filterStatus === tab.key
                                ? 'bg-white text-text-primary shadow-sm'
                                : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {isLoading && (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
                </div>
            )}

            {!isLoading && goals.length === 0 && (
                <div className={`${DS.card} text-center py-12`}>
                    <Target size={40} className="mx-auto text-text-muted mb-3" />
                    <p className={DS.heading3}>Chưa có mục tiêu nào</p>
                    <p className={`${DS.muted} mt-2 mb-4`}>
                        Tạo mục tiêu để bắt đầu quản lý tài chính có mục đích
                    </p>
                    <Button leftIcon={<Plus size={16} />} onClick={openCreate}>Tạo mục tiêu đầu tiên</Button>
                </div>
            )}

            {/* DEBT section — đặt lên trên cùng để dễ thấy */}
            {debtGoals.length > 0 && (
                <section className="flex flex-col gap-3">
                    <h2 className={`${DS.heading3} flex items-center gap-2`}>
                        <span className="w-3 h-3 rounded-full bg-danger-500" />
                        {GOAL_TYPE_CONFIG.DEBT.label} ({debtGoals.length})
                        {debtGoals.some(g => g.overLimit) && (
                            <span className="text-xs bg-danger-100 text-danger-700 px-2 py-0.5 rounded-full font-bold">
                                ⚠ Cần chú ý
                            </span>
                        )}
                    </h2>
                    <div className="flex flex-col gap-3">
                        {debtGoals.map(g => (
                            <GoalCard key={g.id} goal={g} onEdit={() => openEdit(g)} />
                        ))}
                    </div>
                </section>
            )}

            {/* SAVINGS section */}
            {savingsGoals.length > 0 && (
                <section className="flex flex-col gap-3">
                    <h2 className={`${DS.heading3} flex items-center gap-2`}>
                        <span className="w-3 h-3 rounded-full bg-success-500" />
                        {GOAL_TYPE_CONFIG.SAVINGS.label} ({savingsGoals.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {savingsGoals.map(g => (
                            <GoalCard key={g.id} goal={g} onEdit={() => openEdit(g)} />
                        ))}
                    </div>
                </section>
            )}

            {/* INVESTMENT section */}
            {investGoals.length > 0 && (
                <section className="flex flex-col gap-3">
                    <h2 className={`${DS.heading3} flex items-center gap-2`}>
                        <span className="w-3 h-3 rounded-full bg-blue-500" />
                        {GOAL_TYPE_CONFIG.INVESTMENT.label} ({investGoals.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {investGoals.map(g => (
                            <GoalCard key={g.id} goal={g} onEdit={() => openEdit(g)} />
                        ))}
                    </div>
                </section>
            )}

            {/* Freedom Number Calculator */}
            {!isLoading && activeGoals.length > 0 && (
                <FreedomNumberCalculator goals={activeGoals} />
            )}

            {/* Mobile FAB */}
            <button
                onClick={openCreate}
                className="fixed bottom-20 right-4 z-40 md:hidden w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 active:scale-95 transition-all"
                aria-label="Thêm mục tiêu"
            >
                <Plus size={24} />
            </button>

            <GoalFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                editingGoal={editing}
            />
        </div>
    )
}

export default GoalsPage