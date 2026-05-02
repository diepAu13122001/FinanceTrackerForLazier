import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { SummaryCard } from './SummaryCard'
import { PeriodSelector } from '@/components/transactions/PeriodSelector'
import { useTransactionSummary } from '@/hooks/useTransactions'
import { formatVND } from '@/utils/format'
// import { DS } from '@/lib/design-system'
import { useState } from 'react'
import type { SummaryParams } from '@/services/transactionService'
import { useNavigate } from 'react-router-dom'
import { usePlan } from '@/hooks/usePlan'

export const SummaryCards = () => {
    const navigate = useNavigate()
    const { isFree } = usePlan()

    const [summaryParams, setSummaryParams] = useState<SummaryParams>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    })

    const { data: summary, isLoading } = useTransactionSummary(summaryParams)

    return (
        <div className="flex flex-col gap-4">

            {/* Period selector */}
            <PeriodSelector
                params={summaryParams}
                onChange={setSummaryParams}
            />

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard
                    label="Thu nhập"
                    value={summary ? formatVND(summary.totalIncome) : '—'}
                    icon={TrendingUp}
                    colorClass="text-success-600"
                    loading={isLoading}
                />
                <SummaryCard
                    label="Chi tiêu"
                    value={summary ? formatVND(summary.totalExpense) : '—'}
                    icon={TrendingDown}
                    colorClass="text-danger-600"
                    loading={isLoading}
                />
                <SummaryCard
                    label="Số dư"
                    value={summary ? formatVND(summary.balance) : '—'}
                    icon={Wallet}
                    colorClass={
                        summary
                            ? summary.balance >= 0 ? 'text-success-600' : 'text-danger-600'
                            : 'text-text-primary'
                    }
                    loading={isLoading}
                />
            </div>

            {/* Cảnh báo giới hạn giao dịch cho Free user */}
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