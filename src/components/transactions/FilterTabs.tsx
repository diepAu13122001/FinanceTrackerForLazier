import { DS } from '@/lib/design-system'
import type { FilterType } from '@/services/transactionService'

interface FilterTabsProps {
    active: FilterType
    onChange: (filter: FilterType) => void
    // Hiển thị số lượng nếu có
    counts?: {
        all: number
        income: number
        expense: number
    }
}

const TABS: { key: FilterType; label: string; activeClass: string }[] = [
    {
        key: 'ALL',
        label: 'Tất cả',
        activeClass: 'bg-white text-text-primary shadow-sm',
    },
    {
        key: 'INCOME',
        label: '↑ Thu nhập',
        activeClass: 'bg-success-500 text-white shadow-sm',
    },
    {
        key: 'EXPENSE',
        label: '↓ Chi tiêu',
        activeClass: 'bg-danger-500 text-white shadow-sm',
    },
]

export const FilterTabs = ({ active, onChange, counts }: FilterTabsProps) => (
    <div className="flex p-1 bg-surface-muted rounded-lg w-fit gap-1">
        {TABS.map(tab => (
            <button
                className={`
                    px-3 py-1.5 rounded-md text-sm font-medium
                    transition-all duration-200  
                    ${active === tab.key
                        ? tab.activeClass
                        : 'text-text-muted hover:text-text-primary'
                    }
                `}
                key={tab.key}
                onClick={() => onChange(tab.key)}
            >
                {tab.label}

                {/* Badge số lượng */}
                {counts && (
                    <span className={`
            text-xs px-1.5 py-0.5 rounded-full
            ${active === tab.key
                            ? 'bg-white/20 text-white'
                            : 'bg-surface-border text-text-muted'
                        }
          `}>
                        {tab.key === 'ALL'
                            ? counts.all
                            : tab.key === 'INCOME'
                                ? counts.income
                                : counts.expense
                        }
                    </span>
                )}
            </button>
        ))}
    </div>
)