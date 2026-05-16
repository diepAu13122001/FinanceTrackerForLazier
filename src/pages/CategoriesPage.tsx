import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { DS } from '@/lib/design-system'
import { useCategories } from '@/hooks/useCategories'
import { CategoryCard } from '@/components/categories/CategoryCard'
import { CategoryFormModal } from '@/components/categories/CategoryFormModal'
import { CategoryTransactionsDrawer } from '@/components/categories/CategoryTransactionsDrawer'
import { animations } from '@/lib/animations'
import type { CategoryResponse } from '@/types/category'
import type { TransactionType } from '@/types/transaction'
import { usePlan } from '@/hooks/usePlan'
import { UpgradePrompt } from '@/components/shared'

const CategoriesPage = () => {

    const { isPlus } = usePlan()

    if (!isPlus) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div>
                    <h1 className={DS.heading1}>Danh mục</h1>
                    <p className={DS.muted}>Bấm vào danh mục để xem giao dịch</p>
                </div>
                <div className="mt-6"><UpgradePrompt requiredPlan="PLUS" layout="card" /></div>
            </div>
        )
    }

    const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL')
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<CategoryResponse | null>(null)
    const [drawerCategory, setDrawerCategory] = useState<CategoryResponse | null>(null)

    const typeParam = filterType === 'ALL' ? undefined : filterType
    const { data: categories, isLoading } = useCategories(typeParam)

    const openCreateModal = () => { setEditing(null); setModalOpen(true) }
    const openEditModal = (cat: CategoryResponse) => { setEditing(cat); setModalOpen(true) }
    const openDrawer = (cat: CategoryResponse) => setDrawerCategory(cat)

    const incomeCategories = categories?.filter(c => c.type === 'INCOME') ?? []
    const expenseCategories = categories?.filter(c => c.type === 'EXPENSE') ?? []

    return (
        <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">

            <div className={`flex items-center justify-between ${animations.fadeInUp}`}>
                <div>
                    <h1 className={DS.heading1}>Danh mục</h1>
                    <p className={DS.muted}>Bấm vào danh mục để xem giao dịch</p>
                </div>
                <div className="hidden md:block">
                    <Button leftIcon={<Plus size={16} />} onClick={openCreateModal}>
                        Thêm danh mục
                    </Button>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 p-1 bg-surface-muted rounded-lg w-fit">
                {([
                    { key: 'ALL', label: 'Tất cả' },
                    { key: 'EXPENSE', label: 'Chi tiêu' },
                    { key: 'INCOME', label: 'Thu nhập' },
                ] as const).map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilterType(tab.key)}
                        className={`
                            px-4 py-1.5 rounded-md text-sm font-medium transition-all
                            ${filterType === tab.key
                                ? 'bg-white text-text-primary shadow-sm'
                                : 'text-text-secondary hover:text-text-primary'
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {isLoading && (
                <div className="text-center py-12 text-text-muted">Đang tải...</div>
            )}

            {!isLoading && (!categories || categories.length === 0) && (
                <div className={`${DS.card} text-center py-12`}>
                    <p className={DS.heading3}>Chưa có danh mục nào</p>
                    <p className={`${DS.muted} mt-2 mb-4`}>Tạo danh mục đầu tiên để phân loại giao dịch</p>
                    <Button leftIcon={<Plus size={16} />} onClick={openCreateModal}>Tạo danh mục</Button>
                </div>
            )}

            {!isLoading && categories && categories.length > 0 && (
                <div className="flex flex-col gap-6">
                    {(filterType === 'ALL' || filterType === 'EXPENSE') && expenseCategories.length > 0 && (
                        <section className="flex flex-col gap-3">
                            <h2 className={DS.heading3}>Chi tiêu ({expenseCategories.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {expenseCategories.map(cat => (
                                    <CategoryCard
                                        key={cat.id}
                                        category={cat}
                                        onEdit={() => openEditModal(cat)}
                                        onClick={() => openDrawer(cat)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {(filterType === 'ALL' || filterType === 'INCOME') && incomeCategories.length > 0 && (
                        <section className="flex flex-col gap-3">
                            <h2 className={DS.heading3}>Thu nhập ({incomeCategories.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {incomeCategories.map(cat => (
                                    <CategoryCard
                                        key={cat.id}
                                        category={cat}
                                        onEdit={() => openEditModal(cat)}
                                        onClick={() => openDrawer(cat)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}

            <button
                onClick={openCreateModal}
                className="fixed bottom-20 right-4 z-40 md:hidden w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-200 hover:bg-primary-600 active:scale-95 transition-all duration-150"
                aria-label="Thêm danh mục"
            >
                <Plus size={24} />
            </button>

            <CategoryFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                editingCategory={editing}
                defaultType={filterType === 'ALL' ? 'EXPENSE' : filterType}
            />

            <CategoryTransactionsDrawer
                category={drawerCategory}
                onClose={() => setDrawerCategory(null)}
            />
        </div>
    )
}

export default CategoriesPage