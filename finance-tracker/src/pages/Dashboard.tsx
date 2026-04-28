import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal'
import { DS } from '@/lib/design-system'
import { Plus } from 'lucide-react'

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className={DS.heading1}>Dashboard</h1>
                <Button
                    leftIcon={<Plus size={16} />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Thêm giao dịch
                </Button>
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    console.log('Thêm thành công — Ngày 15 sẽ refresh danh sách')
                }}
            />
        </div>
    )
}

export default Dashboard