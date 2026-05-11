import { useState } from 'react'
import { DS } from '@/lib/design-system'
import { Button } from '@/components/shared/Button'
import { TransactionList } from '@/components/transactions/TransactionList'
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal'
import { Plus } from 'lucide-react'
import type { FilterType, TransactionType } from '@/types/transaction'

const ExpensesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    // 🔄 SỬA: lift filter state lên để pass defaultType vào modal
    const [activeFilter, setActiveFilter] = useState<FilterType>('ALL')

    // Map FilterType → TransactionType để pass vào modal
    const defaultTypeForModal: TransactionType =
        activeFilter === 'INCOME' ? 'INCOME' : 'EXPENSE'

    return (
        <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={DS.heading1}>Giao dịch</h1>
                    <p className={DS.muted}>Lịch sử thu chi của bạn</p>
                </div>
                <Button
                    leftIcon={<Plus size={16} />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Thêm mới
                </Button>
            </div>

            {/* Danh sách — 👇 truyền filter state xuống */}
            <TransactionList
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            {/* Modal — 👇 defaultType theo filter đang chọn */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => { }}
                defaultType={defaultTypeForModal}
            />

        </div>
    )
}

export default ExpensesPage