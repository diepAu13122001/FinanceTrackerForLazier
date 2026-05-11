import { useMemo, useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { TransactionItem } from './TransactionItem'
import { AddTransactionModal } from './AddTransactionModal'
import { FilterTabs } from './FilterTabs'
import { DS } from '@/lib/design-system'
import { Button } from '@/components/shared/Button'
import { formatRelativeDateVI } from '@/utils/format'
import type { TransactionResponse, FilterType } from '@/services/transactionService'
import {
    TransactionItemSkeleton,
    Skeleton,
} from '@/components/shared/Skeleton'
import { NoTransactionsEmptyState } from '../shared/EmptyState'
import type { TransactionType } from '@/types/category'

const groupByDate = (transactions: TransactionResponse[]) =>
    transactions.reduce<Record<string, TransactionResponse[]>>(
        (groups, t) => ({
            ...groups,
            [t.transactionDate]: [...(groups[t.transactionDate] ?? []), t],
        }),
        {}
    )

// ─── Props ────────────────────────────────────────────────────────────────────

interface TransactionListProps {
    activeFilter?: FilterType                     // controlled từ parent
    onFilterChange?: (f: FilterType) => void
}

type EditTransactionData = {
    id: string
    type: TransactionType
    amount: number
    note: string | null
    transactionDate: string
    categoryId: string | null   // string ID, không phải object
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TransactionList = ({
    activeFilter: externalFilter,
    onFilterChange: externalOnChange,
}: TransactionListProps = {}) => {

    const [page, setPage] = useState(0)
    const [internalFilter, setInternal] = useState<FilterType>('ALL')
    const [editData, setEditData] = useState<EditTransactionData | null>(null)
    const [isModalOpen, setIsModal] = useState(false)

    // Controlled nếu có externalFilter, ngược lại dùng internal
    const filter = externalFilter ?? internalFilter

    const { data, isLoading, error, refetch } = useTransactions(page, filter)

    const handleFilterChange = (newFilter: FilterType) => {
        if (externalOnChange) externalOnChange(newFilter)
        else setInternal(newFilter)
        setPage(0)  // Reset về trang đầu khi đổi filter
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
                <Button variant="ghost" size="sm" onClick={() => refetch()}>Thử lại</Button>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col gap-3">

                <FilterTabs active={filter} onChange={handleFilterChange} />

                {dates.length === 0 ? (
                    <div className={DS.card}>
                        <NoTransactionsEmptyState
                            onAdd={() => setIsModal(true)}
                            filter={filter}
                        />
                    </div>
                ) : (
                    <div className={`${DS.card} flex flex-col gap-1`}>
                        {dates.map(date => (
                            <div key={date}>
                                <DayHeader date={date} transactions={grouped[date]} />
                                {grouped[date].map(transaction => (
                                    <TransactionItem
                                        key={transaction.id}
                                        transaction={transaction}
                                        onEdit={(t) => {
                                            setEditData({
                                                id: t.id,
                                                type: t.type,
                                                amount: t.amount,
                                                note: t.note,
                                                transactionDate: t.transactionDate,
                                                categoryId: t.category?.id ?? null,
                                            })
                                            setIsModal(true)
                                        }}
                                    />
                                ))}
                            </div>
                        ))}

                        {(data?.totalPages ?? 0) > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border mt-2">
                                <span className={DS.muted}>
                                    Hiển thị {data?.content.length} / {data?.totalElements} giao dịch
                                </span>
                                <div className="flex gap-2">
                                    {!data?.first && (
                                        <Button
                                            variant="ghost" size="sm"
                                            onClick={() => setPage(p => p - 1)}
                                        >
                                            ← Trước
                                        </Button>
                                    )}
                                    {!data?.last && (
                                        <Button
                                            variant="ghost" size="sm"
                                            onClick={() => setPage(p => p + 1)}
                                        >
                                            Tiếp →
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 🔄 SỬA: thêm defaultType vào edit modal */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => { setIsModal(false); setEditData(null) }}
                onSuccess={() => { }}
                editData={editData}
                defaultType={editData?.type ?? (filter === 'INCOME' ? 'INCOME' : 'EXPENSE')}
            />
        </>
    )
}

// ─── DayHeader ────────────────────────────────────────────────────────────────

const DayHeader = ({
    date,
    transactions,
}: {
    date: string
    transactions: TransactionResponse[]
}) => (
    <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs font-medium text-text-muted">
            {formatRelativeDateVI(date)}
        </span>
    </div>
)