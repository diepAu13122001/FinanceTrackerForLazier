import { useState } from 'react'
import { Trash2, Pencil } from 'lucide-react'
import { DS } from '@/lib/design-system'
import { formatVND } from '@/utils/format'
import { useDeleteTransaction } from '@/hooks/useTransactions'
import type { TransactionResponse } from '@/services/transactionService'

interface TransactionItemProps {
    transaction: TransactionResponse
    onEdit: (transaction: TransactionResponse) => void
}

export const TransactionItem = ({ transaction, onEdit }: TransactionItemProps) => {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const deleteMutation = useDeleteTransaction()

    const isIncome = transaction.type === 'INCOME'
    const amountStr = `${isIncome ? '+' : '-'} ${formatVND(transaction.amount)}`

    const handleDelete = async () => {
        if (!confirmDelete) {
            // Click lần 1 → hiện confirm
            setConfirmDelete(true)
            // Tự reset sau 3 giây nếu không confirm
            setTimeout(() => setConfirmDelete(false), 3000)
            return
        }
        // Click lần 2 → xóa thật
        await deleteMutation.mutateAsync(transaction.id)
    }

    return (
        <div className="
            flex items-center gap-3 px-4 py-3 rounded-lg
            hover:bg-surface-muted
            transition-all duration-150 
            group
            ">

            {/* Icon type */}
            <div className={`
        w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm
        ${isIncome ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'}
      `}>
                {isIncome ? '↑' : '↓'}
            </div>

            {/* Nội dung */}
            <div className="flex-1 min-w-0">
                <p className={`${DS.body} truncate`}>
                    {transaction.note || (isIncome ? 'Thu nhập' : 'Chi tiêu')}
                </p>
                <p className={`${DS.muted} text-xs`}>{transaction.source}</p>
            </div>

            {/* Số tiền */}
            <span className={`
        text-sm font-semibold shrink-0
        ${isIncome ? 'text-success-600' : 'text-danger-600'}
      `}>
                {amountStr}
            </span>

            {/* Actions — chỉ hiện khi hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(transaction)}
                    className="p-1.5 rounded-md hover:bg-surface-border text-text-muted hover:text-text-primary"
                >
                    <Pencil size={14} />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className={`
                        p-2.5 rounded-md text-text-muted
                        transition-all duration-200
                        ${confirmDelete
                            ? 'bg-danger-500 text-white scale-110'
                            : 'hover:bg-surface-border hover:text-danger-500'
                        }
                    `}
                >
                    <Trash2 size={14} />
                </button>
            </div>

        </div>
    )
}