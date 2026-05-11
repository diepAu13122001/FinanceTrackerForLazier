import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import * as Icons from 'lucide-react'
import { DS } from '@/lib/design-system'
import { useTransactions } from '@/hooks/useTransactions'
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal'
import { formatVND, formatRelativeDateVI } from '@/utils/format'
import type { CategoryResponse } from '@/types/category'
import type { TransactionType } from '@/types/transaction'

const toPascalCase = (str: string): string =>
    str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')

// ─── Props ────────────────────────────────────────────────────────────────────
interface CategoryTransactionsDrawerProps {
    category: CategoryResponse | null   // null = đóng drawer
    onClose: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────
export const CategoryTransactionsDrawer = ({
    category,
    onClose,
}: CategoryTransactionsDrawerProps) => {

    const [page, setPage] = useState(0)
    const [isModalOpen, setIsModal] = useState(false)

    const isOpen = category !== null

    // Fetch transactions của category này
    const { data, isLoading } = useTransactions(
        page, 'ALL',
        category?.id ?? undefined
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = category
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? ((Icons as any)[toPascalCase(category.icon)] || Icons.Tag)
        : Icons.Tag

    return (
        <>
            {/* Backdrop */}
            <div
                className={`
                    fixed inset-0 z-40
                    bg-black/40 backdrop-blur-sm
                    transition-opacity duration-300
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                onClick={onClose}
            />

            {/* Drawer — slide từ phải */}
            <div
                className={`
                    fixed top-0 right-0 z-50
                    h-full w-full sm:w-[420px]
                    bg-surface shadow-2xl
                    flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* Header */}
                <div className="flex-shrink-0 border-b border-surface-border">
                    {/* Category info bar */}
                    {category && (
                        <div className="flex items-center gap-3 px-5 py-4">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                    backgroundColor: category.color + '25',
                                    color: category.color,
                                }}
                            >
                                <IconComponent size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-text-primary truncate">
                                    {category.name}
                                </div>
                                <div className="text-xs text-text-muted">
                                    {category.type === 'INCOME' ? '↑ Thu nhập' : '↓ Chi tiêu'}
                                    {category.transactionCount !== undefined && (
                                        <span> · {category.transactionCount} giao dịch</span>
                                    )}
                                    {category.totalAmount !== undefined && category.totalAmount > 0 && (
                                        <span
                                            className="ml-1 font-semibold"
                                            style={{ color: category.color }}
                                        >
                                            · {formatVND(category.totalAmount)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Nút thêm giao dịch cho category này */}
                            <button
                                onClick={() => setIsModal(true)}
                                className="
                                    flex-shrink-0 w-8 h-8 rounded-lg
                                    flex items-center justify-center
                                    bg-primary-50 text-primary-600
                                    hover:bg-primary-100 transition-colors
                                "
                                aria-label="Thêm giao dịch"
                            >
                                <Plus size={16} />
                            </button>

                            <button
                                onClick={onClose}
                                className="
                                    flex-shrink-0 p-1.5 rounded-lg
                                    hover:bg-surface-muted text-text-muted
                                    transition-colors
                                "
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Content — scrollable */}
                <div className="flex-1 overflow-y-auto">

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center h-32 text-text-muted text-sm">
                            Đang tải...
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && data?.empty && (
                        <div className="flex flex-col items-center justify-center h-48 gap-3">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: category?.color + '20', color: category?.color }}
                            >
                                <IconComponent size={28} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-text-primary">
                                    Chưa có giao dịch
                                </p>
                                <p className="text-xs text-text-muted mt-1">
                                    Thêm giao dịch cho danh mục này
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModal(true)}
                                className="
                                    mt-1 px-4 py-2 rounded-lg text-sm font-semibold
                                    text-white transition-opacity hover:opacity-85
                                "
                                style={{ backgroundColor: category?.color }}
                            >
                                Thêm giao dịch
                            </button>
                        </div>
                    )}

                    {/* Transaction list */}
                    {!isLoading && data && !data.empty && (
                        <div className="divide-y divide-surface-border">
                            {data.content.map(tx => (
                                <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-muted transition-colors">
                                    {/* Type indicator */}
                                    <div
                                        className={`
                                            flex-shrink-0 w-9 h-9 rounded-full
                                            flex items-center justify-center text-xs font-bold
                                            ${tx.type === 'INCOME'
                                                ? 'bg-success-50 text-success-600'
                                                : 'bg-danger-50 text-danger-600'
                                            }
                                        `}
                                    >
                                        {tx.type === 'INCOME' ? '↑' : '↓'}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-text-primary truncate">
                                            {tx.note || (tx.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu')}
                                        </div>
                                        <div className="text-xs text-text-muted">
                                            {formatRelativeDateVI(tx.transactionDate)}
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div
                                        className={`
                                            flex-shrink-0 text-sm font-semibold
                                            ${tx.type === 'INCOME' ? 'text-success-600' : 'text-danger-600'}
                                        `}
                                    >
                                        {tx.type === 'INCOME' ? '+' : '-'}
                                        {formatVND(tx.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && data && data.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 px-5 py-4 border-t border-surface-border">
                            <button
                                onClick={() => setPage(p => p - 1)}
                                disabled={data.first}
                                className="px-3 py-1.5 text-sm rounded-lg border border-surface-border disabled:opacity-40 hover:bg-surface-muted transition-colors"
                            >
                                ← Trước
                            </button>
                            <span className="text-xs text-text-muted font-mono">
                                {page + 1} / {data.totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={data.last}
                                className="px-3 py-1.5 text-sm rounded-lg border border-surface-border disabled:opacity-40 hover:bg-surface-muted transition-colors"
                            >
                                Tiếp →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Transaction Modal — pre-fill category */}
            {category && (
                <AddTransactionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModal(false)}
                    onSuccess={() => setIsModal(false)}
                    defaultType={category.type as TransactionType}
                    defaultCategoryId={category.id} 
                    editData={null}
                />
            )}
        </>
    )
}