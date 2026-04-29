import { TransactionList } from '@/components/transactions/TransactionList'
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal'
import { useTransactionSummary } from '@/hooks/useTransactions'
import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { DS } from '@/lib/design-system'
import { formatVND } from '@/utils/format'
import { LogOut, Plus } from 'lucide-react'
import { PeriodSelector } from '@/components/transactions/PeriodSelector'
import type { SummaryParams } from '@/services/transactionService'

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Mặc định: tháng hiện tại
    const [summaryParams, setSummaryParams] = useState<SummaryParams>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    })

    const { data: summary } = useTransactionSummary(summaryParams)

    return (
        <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
            <Button variant='danger' leftIcon={<LogOut size={16} />} onClick={() => { localStorage.clear(); location.reload(); }}>Logout</Button>

            <div className="flex items-center justify-between">
                <h1 className={DS.heading1}>Dashboard</h1>
                <Button leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
                    Thêm giao dịch
                </Button>
            </div>

            {/* Period selector */}
            <PeriodSelector
                params={summaryParams}
                onChange={setSummaryParams}
            />

            {/* Summary cards */}
            {summary && (
                <div className="grid grid-cols-3 gap-4">
                    <div className={DS.card}>
                        <p className={DS.muted}>Thu nhập</p>
                        <p className="text-lg font-bold text-success-600">
                            {formatVND(summary.totalIncome)}
                        </p>
                    </div>
                    <div className={DS.card}>
                        <p className={DS.muted}>Chi tiêu</p>
                        <p className="text-lg font-bold text-danger-600">
                            {formatVND(summary.totalExpense)}
                        </p>
                    </div>
                    <div className={DS.card}>
                        <p className={DS.muted}>Số dư</p>
                        <p className={`text-lg font-bold ${summary.balance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                            {formatVND(summary.balance)}
                        </p>
                    </div>
                </div>
            )}

            <TransactionList />

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => { }}
            />
        </div>
    )
}

export default Dashboard