import { useState } from 'react'
import { DS } from '@/lib/design-system'
import { Button } from '@/components/shared/Button'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { TransactionList } from '@/components/transactions/TransactionList'
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const user = useAuthStore(s => s.user)

    return (
        <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={DS.heading1}>
                        Xin chào, {user?.firstName} 👋
                    </h1>
                    <p className={DS.muted}>Đây là tổng quan tài chính của bạn</p>
                </div>
                <Button
                    leftIcon={<Plus size={16} />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Thêm giao dịch
                </Button>
            </div>

            {/* Summary cards + period selector */}
            <SummaryCards />

            {/* Giao dịch gần đây */}
            <div className="flex flex-col gap-3">
                <h2 className={DS.heading2}>Giao dịch gần đây</h2>
                <TransactionList />
            </div>

            {/* Modal */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            />

        </div>
    )
}

export default Dashboard