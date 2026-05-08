import { useState } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { CategoryBadge } from './CategoryBadge'
import { DS } from '@/lib/design-system'
import type { TransactionType } from '@/types/category'
import { Link } from 'react-router-dom'

interface CategorySelectorProps {
    value: string | null
    onChange: (categoryId: string | null) => void
    type: TransactionType
    label?: string
}

export const CategorySelector = ({
    value,
    onChange,
    type,
    label = 'Danh mục',
}: CategorySelectorProps) => {

    const { data: categories, isLoading } = useCategories(type)
    const [open, setOpen] = useState(false)

    const selected = categories?.find(c => c.id === value) ?? null

    return (
        <div className="relative">
            {label && (
                <label className={DS.label}>{label}</label>
            )}

            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`
          ${DS.inputBase}
          flex items-center justify-between
          cursor-pointer
          {selected ? 'py-1.5' : ''} 
        `}
            >
                {selected ? (
                    <CategoryBadge category={selected} size="sm" />
                ) : (
                    <span className="text-text-muted">Chọn danh mục (tùy chọn)</span>
                )}
                <ChevronDown
                    size={16}
                    className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <>
                    {/* Backdrop để đóng khi click ngoài */}
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setOpen(false)}
                    />

                    <div className="
            absolute z-40 mt-1 w-full
            bg-white rounded-lg shadow-lg
            border border-surface-border
            max-h-60 overflow-y-auto
            animate-in fade-in slide-in-from-top-2 duration-150
          ">
                        {/* Option: Bỏ chọn */}
                        <button
                            type="button"
                            onClick={() => { onChange(null); setOpen(false) }}
                            className="
                w-full px-3 py-2 text-left text-sm
                hover:bg-surface-muted transition-colors
                flex items-center gap-2
              "
                        >
                            <span className="text-text-muted italic">Không phân loại</span>
                        </button>

                        {/* Loading */}
                        {isLoading && (
                            <div className="px-3 py-3 text-sm text-text-muted">
                                Đang tải...
                            </div>
                        )}

                        {/* Categories list */}
                        {!isLoading && categories?.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => { onChange(cat.id); setOpen(false) }}
                                className={`
                  w-full px-3 py-2 text-left
                  hover:bg-surface-muted transition-colors
                  flex items-center gap-2
                  ${value === cat.id ? 'bg-surface-muted' : ''}
                `}
                            >
                                <CategoryBadge category={cat} size="sm" />
                            </button>
                        ))}

                        {/* Empty state với link tạo mới */}
                        {!isLoading && (!categories || categories.length === 0) && (
                            <Link
                                to="/categories"
                                className="
                  block px-3 py-3 text-sm text-primary-600
                  hover:bg-primary-50 transition-colors
                  border-t border-surface-border
                  flex items-center gap-2
                "
                                onClick={() => setOpen(false)}
                            >
                                <Plus size={14} />
                                Tạo danh mục đầu tiên
                            </Link>
                        )}

                        {/* Footer link */}
                        {!isLoading && categories && categories.length > 0 && (
                            <Link
                                to="/categories"
                                className="
                  block px-3 py-2 text-xs text-primary-600
                  hover:bg-primary-50 transition-colors
                  border-t border-surface-border
                  flex items-center gap-1.5
                "
                                onClick={() => setOpen(false)}
                            >
                                <Plus size={12} />
                                Quản lý danh mục
                            </Link>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
