import { useMemo, useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { TransactionItem } from './TransactionItem'
import { AddTransactionModal } from './AddTransactionModal'
import { FilterTabs } from './FilterTabs'
import { DS } from '@/lib/design-system'
import { Button } from '@/components/shared/Button'
import { formatRelativeDateVI } from '@/utils/format'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { TransactionResponse, FilterType } from '@/services/transactionService'
import {
    TransactionItemSkeleton,
    Skeleton,
} from '@/components/shared/Skeleton'
import { NoTransactionsEmptyState } from '../shared/EmptyState'

const groupByDate = (transactions: TransactionResponse[]) =>
    transactions.reduce<Record<string, TransactionResponse[]>>(
        (groups, t) => ({
            ...groups,
            [t.transactionDate]: [...(groups[t.transactionDate] ?? []), t],
        }),
        {}
    )

export const TransactionList = () => {
    const [page, setPage] = useState(0)
    const [filter, setFilter] = useState<FilterType>('ALL')
    const [editData, setEditData] = useState<TransactionResponse | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { data, isLoading, error, refetch } = useTransactions(page, filter)

    // Reset về trang 0 khi đổi filter
    const handleFilterChange = (newFilter: FilterType) => {
        setFilter(newFilter)
        setPage(0)
    }

    const grouped = useMemo(
        () => groupByDate(data?.content ?? []),
        [data?.content]
    )
    const dates = useMemo(
        () => Object.keys(grouped).sort((a, b) => b.localeCompare(a)),
        [grouped]
    )


    // ── Loading ─────────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex flex-col gap-3">
                <Skeleton className="h-9 w-64 rounded-lg" />
                <div className={`${DS.card} flex flex-col gap-1`}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <TransactionItemSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }

    // ── Error ───────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className={DS.card}>
                <p className="text-danger-600 text-sm mb-2">Không thể tải giao dịch.</p>
                <Button variant="ghost" size="sm" onClick={() => refetch()}>
                    Thử lại
                </Button>
            </div>
        )
    }


    return (
        <>
            <div className="flex flex-col gap-3">

                {/* Filter tabs */}
                <FilterTabs
                    active={filter}
                    onChange={handleFilterChange}
                />

                {/* Danh sách */}
                {dates.length === 0 ? (
                    <div className={DS.card}>
                        <NoTransactionsEmptyState
                            onAdd={() => setIsModalOpen(true)}
                            filter={filter}
                        />
                    </div>
                ) : (
                    <div className={`${DS.card} flex flex-col gap-1`}>
                        {dates.map(date => (
                            <div key={date}>
                                {/* Header ngày + tổng ngày */}
                                <DayHeader date={date} transactions={grouped[date]} />

                                {/* Giao dịch trong ngày */}
                                {grouped[date].map(transaction => (
                                    <TransactionItem
                                        key={transaction.id}
                                        transaction={transaction}
                                        onEdit={(t) => {
                                            setEditData(t)
                                            setIsModalOpen(true)
                                        }}
                                    />
                                ))}
                            </div>
                        ))}

                        {/* Pagination */}
                        {(data?.totalPages ?? 0) > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border mt-2">
                                {/* <span className={DS.muted}>
                                    Trang {(data?.number ?? 0) + 1} / {data?.totalPages}
                                </span> */}
                                <span className={DS.muted}>
                                    Hiển thị {data?.content.length} / {data?.totalElements} giao dịch
                                </span>
                                <div className="flex gap-2">
                                    {/* <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={page === 0}
                                        onClick={() => setPage(p => p - 1)}
                                        leftIcon={<ChevronLeft size={14} />}
                                    >
                                        Trước
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={page >= (data?.totalPages ?? 1) - 1}
                                        onClick={() => setPage(p => p + 1)}
                                        rightIcon={<ChevronRight size={14} />}
                                    >
                                        Tiếp
                                    </Button> */}
                                    {!data?.last && (
                                        <Button onClick={() => setPage(p => p + 1)}>Tiếp</Button>
                                    )}
                                    {!data?.first && (
                                        <Button onClick={() => setPage(p => p - 1)}>Trước</Button>
                                    )}


                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal edit */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditData(null)
                }}
                onSuccess={() => { }}
                editData={editData}
            />
        </>
    )
}

// ─── Sub-component: Header mỗi ngày + tổng ───────────────────────────────────

const DayHeader = ({
    date,
    transactions,
}: {
    date: string
    transactions: TransactionResponse[]
}) => {
    // const totalIncome = transactions
    //     .filter(t => t.type === 'INCOME')
    //     .reduce((sum, t) => sum + t.amount, 0)

    // const totalExpense = transactions
    //     .filter(t => t.type === 'EXPENSE')
    //     .reduce((sum, t) => sum + t.amount, 0)

    return (
        <div className="flex items-center justify-between px-4 py-2">
            <span className="text-xs font-medium text-text-muted">
                {formatRelativeDateVI(date)}
            </span>
            {/* <div className="flex items-center gap-3 text-xs">
                {totalIncome > 0 && (
                    <span className="text-success-600">
                        +{totalIncome.toLocaleString('vi-VN')}₫
                    </span>
                )}
                {totalExpense > 0 && (
                    <span className="text-danger-600">
                        -{totalExpense.toLocaleString('vi-VN')}₫
                    </span>
                )}
            </div> */}
        </div>
    )
}