import { useState } from 'react'
import { DS } from '@/lib/design-system'
import { Button } from '@/components/shared/Button'
import { TransactionList } from '@/components/transactions/TransactionList'
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal'
import { Download, Plus } from 'lucide-react'
import type { FilterType, TransactionType } from '@/types/transaction'
import { exportService } from '@/services/exportService'
import { notify } from '@/lib/toast'

const ExpensesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState<FilterType>('ALL')
    const [isExporting, setIsExporting] = useState(false);

    // Map FilterType → TransactionType để pass vào modal
    const defaultTypeForModal: TransactionType =
        activeFilter === 'INCOME' ? 'INCOME' : 'EXPENSE';

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await exportService.downloadExcel();
            notify.success('Xuất Excel thành công');
        } catch {
            notify.error('Xuất thất bại, thử lại sau');
        } finally {
            setIsExporting(false);
        }
    };
    return (
        <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={DS.heading1}>Giao dịch</h1>
                    <p className={DS.muted}>Lịch sử thu chi của bạn</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden md:block">
                        <Button
                            leftIcon={<Plus size={16} />}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Thêm mới
                        </Button>

                    </div>

                    <div>
                        <Button
                            variant="ghost"
                            leftIcon={<Download size={16} />}
                            loading={isExporting}
                            onClick={handleExport}
                        >
                            Xuất Excel
                        </Button>
                    </div>
                </div>

            </div>

            {/* Danh sách — 👇 truyền filter state xuống */}
            <TransactionList
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            {/* FAB — chỉ hiện trên mobile, ẩn từ md trở lên */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="
                    fixed bottom-20 right-4 z-40
                    md:hidden
                    w-14 h-14 rounded-full
                    bg-primary-500 text-white
                    flex items-center justify-center
                    shadow-lg shadow-primary-200
                    hover:bg-primary-600 active:scale-95
                    transition-all duration-150
                "
                aria-label="Thêm giao dịch"
            >
                <Plus size={24} />
            </button>

            {/* Modal — dùng chung cho cả desktop button và mobile FAB */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                defaultType={defaultTypeForModal}

            />

        </div>
    )
}

export default ExpensesPage