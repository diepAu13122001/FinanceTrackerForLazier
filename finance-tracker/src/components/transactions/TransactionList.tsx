import { useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { TransactionItem } from './TransactionItem'
import { AddTransactionModal } from './AddTransactionModal'
import { DS } from '@/lib/design-system'
import { Button } from '@/components/shared/Button'
import { formatDateVI } from '@/utils/format'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { TransactionResponse } from '@/services/transactionService'

// ─── Group giao dịch theo ngày ────────────────────────────────────────────────
const groupByDate = (transactions: TransactionResponse[]) => {
    return transactions.reduce<Record<string, TransactionResponse[]>>(
        (groups, transaction) => {
            const date = transaction.transactionDate
            return {
                ...groups,
                [date]: [...(groups[date] ?? []), transaction],
            }
        },
        {}
    )
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TransactionList = () => {
    const [page, setPage] = useState(0)
    const [editData, setEditData] = useState<TransactionResponse | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { data, isLoading, error, refetch } = useTransactions(page)

    // ── Loading state ───────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className={`${DS.card} flex flex-col gap-3`}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-14 bg-surface-muted rounded-lg animate-pulse" />
                ))}
            </div>
        )
    }

    // ── Error state ─────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className={DS.card}>
                <p className="text-danger-600 text-sm">Không thể tải giao dịch.</p>
                <Button variant="ghost" size="sm" onClick={() => refetch()}>
                    Thử lại
                </Button>
            </div>
        )
    }

    // ── Empty state ─────────────────────────────────────────────────────────────
    if (!data || data.content.length === 0) {
        return (
            <div className={`${DS.card} flex flex-col items-center gap-3 py-12`}>
                <span className="text-4xl">📭</span>
                <p className={DS.muted}>Chưa có giao dịch nào. Thêm ngay!</p>
            </div>
        )
    }

    const grouped = groupByDate(data.content)
    const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

    return (
        <>
            <div className={`${DS.card} flex flex-col gap-1`}>

                {/* Danh sách giao dịch group theo ngày */}
                {dates.map(date => (
                    <div key={date}>

                        {/* Header ngày */}
                        <div className="px-4 py-2">
                            <span className={`${DS.label} text-xs`}>
                                {formatDateVI(date)}
                            </span>
                        </div>

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
                {data.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border mt-2">
                        <span className={DS.muted}>
                            Trang {data.number + 1} / {data.totalPages}
                        </span>
                        <div className="flex gap-2">
                            <Button
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
                                disabled={page >= data.totalPages - 1}
                                onClick={() => setPage(p => p + 1)}
                                rightIcon={<ChevronRight size={14} />}
                            >
                                Tiếp
                            </Button>
                        </div>
                    </div>
                )}

            </div>

            {/* Modal edit — dùng lại AddTransactionModal */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditData(null)
                }}
                onSuccess={() => refetch()}
                editData={editData}
            />
        </>
    )
}