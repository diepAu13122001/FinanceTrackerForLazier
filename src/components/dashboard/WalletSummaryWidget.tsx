import { useNavigate } from 'react-router-dom'
import { Wallet, ChevronRight, Plus } from 'lucide-react'
import * as Icons from 'lucide-react'
import { DS } from '@/lib/design-system'
import { useActiveGoals } from '@/hooks/useGoals'
import { usePlan } from '@/hooks/usePlan'
import { GOAL_TYPE_CONFIG } from '@/types/goal'
import { formatVND } from '@/utils/format'
import { Skeleton } from '@/components/shared/Skeleton'

const toPascalCase = (s: string) =>
    s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')

export const WalletSummaryWidget = () => {
    const navigate = useNavigate()
    const { isPlus } = usePlan()
    const { data: wallets, isLoading } = useActiveGoals(isPlus)  // Chỉ fetch wallets nếu user là Plus

    if (!isPlus) return null  // Free user không fetch

    if (isLoading) {
        return (
            <div className={DS.card}>
                <Skeleton className="h-5 w-32 mb-3" />
                <div className="flex gap-2 overflow-x-auto">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-28 flex-shrink-0 rounded-xl" />)}
                </div>
            </div>
        )
    }

    if (!wallets || wallets.length === 0) {
        return (
            <div className={`${DS.card} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <Wallet size={18} className="text-text-muted" />
                    <span className="text-sm text-text-muted">Chưa có nguồn tiền nào</span>
                </div>
                <button
                    onClick={() => navigate('/goals')}
                    className="text-sm text-primary-600 flex items-center gap-1"
                >
                    <Plus size={14} /> Thêm
                </button>
            </div>
        )
    }

    // Tổng tài sản = NORMAL balance + SAVINGS current + INVESTMENT current - DEBT current
    const totalAssets = wallets.reduce((sum, w) => {
        if (w.type === 'DEBT') return sum - w.currentAmount
        return sum + w.balance
    }, 0)

    return (
        <div className={DS.card}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Wallet size={18} className="text-primary-600" />
                    <span className={DS.heading3}>Nguồn tiền</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-xs text-text-muted">Tài sản ròng</div>
                        <div className={`text-sm font-bold ${totalAssets >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                            {formatVND(Math.abs(totalAssets))}
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/goals')}
                        className="text-primary-600 hover:text-primary-700"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Wallet cards — horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {wallets.map(wallet => {
                    const config = GOAL_TYPE_CONFIG[wallet.type]
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const IconComp = (Icons as any)[toPascalCase(wallet.icon)] || Wallet

                    return (
                        <div
                            key={wallet.id}
                            onClick={() => navigate('/goals')}
                            className="
                                flex-shrink-0 w-32 rounded-xl p-3
                                border border-surface-border cursor-pointer
                                hover:border-primary-200 hover:shadow-sm transition-all
                            "
                            style={{ borderLeftColor: wallet.color, borderLeftWidth: 3 }}
                        >
                            {/* Icon + type badge */}
                            <div className="flex items-center gap-1.5 mb-2">
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: wallet.color + '20', color: wallet.color }}
                                >
                                    <IconComp size={14} />
                                </div>
                                {wallet.overLimit && (
                                    <span className="text-xs text-danger-600">⚠</span>
                                )}
                            </div>

                            {/* Name */}
                            <div className="text-xs font-semibold text-text-primary truncate mb-1">
                                {wallet.name}
                            </div>

                            {/* Balance */}
                            {wallet.type === 'NORMAL' && (
                                <div className={`text-xs font-bold ${wallet.balance >= 0 ? 'text-success-600' : 'text-danger-600'
                                    }`}>
                                    {formatVND(wallet.balance)}
                                </div>
                            )}
                            {wallet.type === 'DEBT' && (
                                <div className="text-xs font-bold text-danger-600">
                                    Nợ: {formatVND(wallet.currentAmount)}
                                </div>
                            )}
                            {(wallet.type === 'SAVINGS' || wallet.type === 'INVESTMENT') && (
                                <>
                                    <div className="text-xs font-bold" style={{ color: wallet.color }}>
                                        {formatVND(wallet.currentAmount)}
                                    </div>
                                    <div className="h-1 bg-surface-muted rounded-full mt-1.5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${Math.min(wallet.progressPercent, 100)}%`,
                                                backgroundColor: wallet.color,
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })}

                {/* Nút thêm ví */}
                <button
                    onClick={() => navigate('/goals')}
                    className="
                        flex-shrink-0 w-20 rounded-xl border border-dashed border-surface-border
                        flex flex-col items-center justify-center gap-1
                        text-text-muted hover:text-primary-600 hover:border-primary-300
                        transition-all
                    "
                >
                    <Plus size={18} />
                    <span className="text-xs">Thêm ví</span>
                </button>
            </div>
        </div>
    )
}