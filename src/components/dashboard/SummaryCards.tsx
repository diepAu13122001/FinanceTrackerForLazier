import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { SummaryCard } from './SummaryCard'
import { PeriodSelector } from '@/components/transactions/PeriodSelector'
import { useTransactionSummary } from '@/hooks/useTransactions'
import { SummaryCardSkeleton } from '@/components/shared/Skeleton'
import { formatVND } from '@/utils/format'
import { DS } from '@/lib/design-system'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlan } from '@/hooks/usePlan'
import { animations } from '@/lib/animations'
import type { SummaryParams } from '@/services/transactionService'

// Stagger delays cho 3 cards
const CARD_DELAYS = ['delay-0', 'delay-75', 'delay-150']

export const SummaryCards = () => {
    const navigate = useNavigate()
    const { isFree } = usePlan()

    const [summaryParams, setSummaryParams] = useState<SummaryParams>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    })

    const { data: summary, isLoading } = useTransactionSummary(summaryParams)

    // Định nghĩa 3 cards với data thật
    const cards = [
        {
            label: 'Thu nhập',
            value: summary ? formatVND(summary.totalIncome) : '—',
            icon: TrendingUp,
            colorClass: 'text-success-600',
        },
        {
            label: 'Chi tiêu',
            value: summary ? formatVND(summary.totalExpense) : '—',
            icon: TrendingDown,
            colorClass: 'text-danger-600',
        },
        {
            label: 'Số dư',
            value: summary ? formatVND(summary.balance) : '—',
            icon: Wallet,
            colorClass: summary
                ? summary.balance >= 0 ? 'text-success-600' : 'text-danger-600'
                : 'text-text-primary',
        },
    ]

    // Tính số ngày trong kỳ
    const daysInPeriod = (() => {
        if (summary?.startDate && summary?.endDate) {
            const diff = new Date(summary.endDate).getTime()
                - new Date(summary.startDate).getTime()
            return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
        }
        // Fallback: số ngày đã qua trong tháng hiện tại
        return new Date().getDate()
    })()

    return (
        <div className="flex flex-col gap-4">

            <PeriodSelector
                params={summaryParams}
                onChange={setSummaryParams}
            />

            {/* Cards với stagger animation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {isLoading ? (
                    // Skeleton không cần animation
                    <>
                        <SummaryCardSkeleton />
                        <SummaryCardSkeleton />
                        <SummaryCardSkeleton />
                    </>
                ) : (
                    // Mỗi card có delay khác nhau → hiệu ứng stagger
                    cards.map((card, i) => (
                        <div
                            key={card.label}
                            className={`${animations.fadeInUp} ${CARD_DELAYS[i]}`}
                        >
                            <SummaryCard {...card} loading={false} />
                        </div>
                    ))
                )}
            </div>

            {!isLoading && summary && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface rounded-xl border border-surface-border px-4 py-3">
                        <div className="text-xs text-text-muted">Chi tiêu TB/ngày</div>
                        <div className="text-base font-bold text-danger-600 mt-1">
                            {(() => {
                                // 🔄 SỬA: dùng optional chaining
                                const daysInPeriod = summary.startDate && summary.endDate
                                    ? Math.max(1, Math.ceil(
                                        (new Date(summary.endDate).getTime()
                                            - new Date(summary.startDate).getTime())
                                        / (1000 * 60 * 60 * 24)
                                    ))
                                    : new Date().getDate()
                                return formatVND(Math.round(summary.totalExpense / daysInPeriod))
                            })()}
                        </div>
                        <div className="text-xs text-text-muted mt-0.5">trong kỳ này</div>
                    </div>

                    <div className="bg-surface rounded-xl border border-surface-border px-4 py-3">
                        <div className="text-xs text-text-muted">Tỉ lệ tiết kiệm</div>
                        <div className={`text-base font-bold mt-1 ${summary.totalIncome > 0 && summary.balance > 0
                                ? 'text-success-600' : 'text-danger-600'
                            }`}>
                            {summary.totalIncome > 0
                                ? `${Math.round((summary.balance / summary.totalIncome) * 100)}%`
                                : '—'
                            }
                        </div>
                        <div className="text-xs text-text-muted mt-0.5">thu nhập tiết kiệm được</div>
                    </div>
                </div>
            )}

            {/* Cảnh báo giới hạn Free */}
            {isFree && summary && (
                <div className={`
          flex items-center justify-between px-4 py-3 rounded-lg
          ${summary.limitReached
                        ? 'bg-danger-50 border border-danger-200'
                        : 'bg-amber-50 border border-amber-200'
                    }
        `}>
                    <p className="text-xs text-amber-700">
                        {summary.limitReached
                            ? '🚫 Bạn đã đạt giới hạn 50 giao dịch tháng này.'
                            : `⚠ ${summary.transactionCount} / 50 giao dịch tháng này.`
                        }
                        {' '}
                        <button
                            onClick={() => navigate('/pricing')}
                            className="underline font-medium"
                        >
                            Nâng cấp Plus
                        </button>
                    </p>
                </div>
            )}

        </div>
    )
}