import { useState } from 'react'
import { Plus, Wallet, Target, CreditCard } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { DS } from '@/lib/design-system'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalFormModal } from '@/components/goals/GoalFormModal'
import { FreedomNumberCalculator } from '@/components/goals/FreedomNumberCalculator'
import { animations } from '@/lib/animations'
import { useGoals } from '@/hooks/useGoals'
import type { GoalResponse, GoalType } from '@/types/goal'
import { Skeleton } from '@/components/shared/Skeleton'
import { formatVND } from '@/utils/format'
import { usePlan } from '@/hooks/usePlan'
import { UpgradePrompt } from '@/components/shared'

type WalletTab = 'NORMAL' | 'GOAL' | 'DEBT'

const GoalsPage = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<GoalResponse | null>(null)
    const [activeTab, setActiveTab] = useState<WalletTab>('NORMAL')
    const [defaultType, setDefaultType] = useState<GoalType>('NORMAL')

    const { isPlus } = usePlan()
    const { data: allGoals, isLoading } = useGoals(isPlus)

    if (!isPlus) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <h1 className={DS.heading1}>Nguồn tiền & Tài khoản</h1>
                <div className="mt-6">
                    <UpgradePrompt requiredPlan="PLUS" layout="card" />
                </div>
            </div>
        )
    }

    const activeGoals = allGoals?.filter(g => g.status === 'ACTIVE') ?? []

    // Group theo tab
    const normalWallets = activeGoals.filter(g => g.type === 'NORMAL')
    const goalWallets = activeGoals.filter(g => g.type === 'SAVINGS' || g.type === 'INVESTMENT')
    const debtWallets = activeGoals.filter(g => g.type === 'DEBT')

    // Summary stats
    const totalAssets = normalWallets.reduce((s, w) => s + w.balance, 0)
        + goalWallets.reduce((s, w) => s + w.currentAmount, 0)
    const totalDebt = debtWallets.reduce((s, w) => s + w.currentAmount, 0)
    const netWorth = totalAssets - totalDebt

    // Tổng cần tích lũy cho goals
    const totalGoalTarget = goalWallets.reduce((s, g) => s + g.targetAmount, 0)
    const totalGoalCurrent = goalWallets.reduce((s, g) => s + g.currentAmount, 0)

    const overLimitDebts = debtWallets.filter(g => g.overLimit).length

    const openCreate = (type: GoalType) => {
        setEditing(null)
        setDefaultType(type)
        setModalOpen(true)
    }
    const openEdit = (g: GoalResponse) => { setEditing(g); setModalOpen(true) }

    const TABS: { key: WalletTab; label: string; icon: typeof Wallet; count: number; defaultGoalType: GoalType }[] = [
        { key: 'NORMAL', label: 'Tài khoản', icon: Wallet, count: normalWallets.length, defaultGoalType: 'NORMAL' },
        { key: 'GOAL', label: 'Mục tiêu', icon: Target, count: goalWallets.length, defaultGoalType: 'SAVINGS' },
        { key: 'DEBT', label: 'Khoản nợ', icon: CreditCard, count: debtWallets.length, defaultGoalType: 'DEBT' },
    ]

    return (
        <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">

            {/* Header */}
            <div className={`flex items-center justify-between ${animations.fadeInUp}`}>
                <div>
                    <h1 className={DS.heading1}>Nguồn tiền & Ví</h1>
                    <p className={DS.muted}>Quản lý tài sản và khoản nợ của bạn</p>
                </div>
                <div className="hidden md:block">
                    <Button leftIcon={<Plus size={16} />}
                        onClick={() => openCreate(TABS.find(t => t.key === activeTab)?.defaultGoalType ?? 'NORMAL')}>
                        Thêm mới
                    </Button>
                </div>
            </div>

            {/* DEBT DANGER Banner */}
            {overLimitDebts > 0 && (
                <div className="bg-danger-50 border-2 border-danger-300 rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="text-sm font-bold text-danger-700">{overLimitDebts} khoản nợ vượt hạn mức!</p>
                        <p className="text-xs text-danger-600 mt-0.5">Hãy ưu tiên trả nợ ngay.</p>
                    </div>
                </div>
            )}

            {/* Summary — 3 số riêng biệt */}
            {!isLoading && activeGoals.length > 0 && (
                <div className={DS.card}>
                    <div className="grid grid-cols-3 gap-4 text-center divide-x divide-surface-border">
                        <div>
                            <div className="text-xs text-text-muted mb-1">Tổng tài sản</div>
                            <div className={`text-base font-bold ${totalAssets >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                                {formatVND(Math.abs(totalAssets))}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-text-muted mb-1">Dư nợ</div>
                            <div className="text-base font-bold text-danger-600">
                                {formatVND(totalDebt)}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-text-muted mb-1">Tài sản ròng</div>
                            <div className={`text-base font-bold ${netWorth >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                                {netWorth < 0 ? '−' : ''}{formatVND(Math.abs(netWorth))}
                            </div>
                        </div>
                    </div>
                    {/* Còn cần tích lũy — chỉ hiện khi có goals */}
                    {goalWallets.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-surface-border text-center">
                            <span className="text-xs text-text-muted">
                                Còn cần tích lũy cho mục tiêu:{' '}
                                <span className="font-bold text-primary-600">
                                    {formatVND(totalGoalTarget - totalGoalCurrent)}
                                </span>
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* 3 Tabs */}
            <div className="flex gap-1 p-1 bg-surface-muted rounded-xl">
                {TABS.map(tab => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.key
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`
                                flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
                                text-sm font-medium transition-all
                                ${isActive
                                    ? 'bg-white text-text-primary shadow-sm'
                                    : 'text-text-secondary hover:text-text-primary'
                                }
                            `}
                        >
                            <Icon size={15} />
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                                    ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-surface-border text-text-muted'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {isLoading && (
                <div className="flex flex-col gap-3">
                    {[1, 2].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
                </div>
            )}

            {/* Tab: Tài khoản (NORMAL) */}
            {activeTab === 'NORMAL' && !isLoading && (
                normalWallets.length === 0 ? (
                    <EmptyState
                        title="Chưa có tài khoản nào"
                        desc="Tạo tài khoản để theo dõi tiền mặt, ngân hàng, ví điện tử..."
                        onAdd={() => openCreate('NORMAL')}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {normalWallets.map(w => (
                            <GoalCard key={w.id} goal={w} onEdit={() => openEdit(w)} />
                        ))}
                    </div>
                )
            )}

            {/* Tab: Mục tiêu (SAVINGS + INVESTMENT) */}
            {activeTab === 'GOAL' && !isLoading && (
                goalWallets.length === 0 ? (
                    <EmptyState
                        title="Chưa có mục tiêu nào"
                        desc="Tạo mục tiêu tích lũy hoặc đầu tư để theo dõi tiến độ..."
                        onAdd={() => openCreate('SAVINGS')}
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {goalWallets.map(w => (
                                <GoalCard key={w.id} goal={w} onEdit={() => openEdit(w)} />
                            ))}
                        </div>
                        {goalWallets.length > 0 && (
                            <FreedomNumberCalculator goals={goalWallets} />
                        )}
                    </>
                )
            )}

            {/* Tab: Khoản nợ (DEBT) */}
            {activeTab === 'DEBT' && !isLoading && (
                debtWallets.length === 0 ? (
                    <EmptyState
                        title="Chưa có khoản nợ nào"
                        desc="Theo dõi thẻ tín dụng và khoản trả góp để kiểm soát tài chính..."
                        onAdd={() => openCreate('DEBT')}
                    />
                ) : (
                    <div className="flex flex-col gap-3">
                        {debtWallets.map(w => (
                            <GoalCard key={w.id} goal={w} onEdit={() => openEdit(w)} />
                        ))}
                    </div>
                )
            )}

            {/* Mobile FAB */}
            <button
                onClick={() => openCreate(TABS.find(t => t.key === activeTab)?.defaultGoalType ?? 'NORMAL')}
                className="fixed bottom-20 right-4 z-40 md:hidden w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 active:scale-95 transition-all"
            >
                <Plus size={24} />
            </button>

            <GoalFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                editingGoal={editing}
                defaultType={defaultType}
            />
        </div>
    )
}

// ── Sub-component ──────────────────────────────────────────────────────────────
const EmptyState = ({ title, desc, onAdd }: { title: string; desc: string; onAdd: () => void }) => (
    <div className={`${DS.card} text-center py-10`}>
        <p className={DS.heading3}>{title}</p>
        <p className={`${DS.muted} mt-2 mb-4`}>{desc}</p>
        <Button leftIcon={<Plus size={16} />} onClick={onAdd}>Tạo mới</Button>
    </div>
)

export default GoalsPage