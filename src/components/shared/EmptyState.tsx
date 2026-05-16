import { DS } from '@/lib/design-system'
import { Button } from './Button'
import type { LucideIcon } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmptyStateProps {
    icon: string           // emoji
    title: string
    description: string
    action?: {
        label: string
        onClick: () => void
        icon?: LucideIcon
    }
    secondaryAction?: {
        label: string
        onClick: () => void
    }
}

// ─── Component ────────────────────────────────────────────────────────────────

export const EmptyState = ({
    icon,
    title,
    description,
    action,
    secondaryAction,
}: EmptyStateProps) => (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-16 px-6">
        <span className="text-5xl" role="img" aria-label={title}>
            {icon}
        </span>

        <div className="flex flex-col gap-1.5 max-w-xs">
            <h3 className={DS.heading3}>{title}</h3>
            <p className={DS.muted}>{description}</p>
        </div>

        {action && (
            <div className="flex flex-col items-center gap-2 mt-2">
                <Button
                    variant="primary"
                    leftIcon={action.icon ? <action.icon size={16} /> : undefined}
                    onClick={action.onClick}
                >
                    {action.label}
                </Button>

                {secondaryAction && (
                    <button
                        onClick={secondaryAction.onClick}
                        className={`${DS.muted} text-sm hover:text-text-secondary underline underline-offset-2`}
                    >
                        {secondaryAction.label}
                    </button>
                )}
            </div>
        )}
    </div>
)

// ─── Preset Empty States ──────────────────────────────────────────────────────
// Dùng sẵn ở nhiều chỗ — không cần truyền props lặp lại

export const NoTransactionsEmptyState = ({
    onAdd,
    filter,
}: {
    onAdd: () => void
    filter: 'ALL' | 'INCOME' | 'EXPENSE' | 'TRANSFER'
}) => {
    const configs = {
        ALL: {
            icon: '📭',
            title: 'Chưa có giao dịch nào',
            description: 'Bắt đầu theo dõi tài chính bằng cách thêm giao dịch đầu tiên',
            actionLabel: 'Thêm giao dịch',
        },
        INCOME: {
            icon: '📈',
            title: 'Chưa có thu nhập nào',
            description: 'Thêm khoản thu nhập để theo dõi dòng tiền vào',
            actionLabel: 'Thêm thu nhập',
        },
        EXPENSE: {
            icon: '📉',
            title: 'Chưa có chi tiêu nào',
            description: 'Thêm khoản chi tiêu để theo dõi dòng tiền ra',
            actionLabel: 'Thêm chi tiêu',
        },
        TRANSFER: {
            icon: '🔄',
            title: 'Chưa có giao dịch chuyển đổi nào',
            description: 'Thêm khoản chuyển đổi để theo dõi dòng tiền giữa các ví',
            actionLabel: 'Thêm chuyển đổi',
        },
    }

    const c = configs[filter]

    return (
        <EmptyState
            icon={c.icon}
            title={c.title}
            description={c.description}
            action={{ label: c.actionLabel, onClick: onAdd }}
        />
    )
}

export const NoDataChartEmptyState = () => (
    <EmptyState
        icon="📊"
        title="Chưa có dữ liệu"
        description="Thêm giao dịch để xem biểu đồ phân tích thu chi"
    />
)

export const NoGoalsEmptyState = ({ onAdd }: { onAdd: () => void }) => (
    <EmptyState
        icon="🎯"
        title="Chưa có mục tiêu nào"
        description="Đặt mục tiêu tiết kiệm để theo dõi tiến độ tài chính"
        action={{ label: 'Tạo mục tiêu đầu tiên', onClick: onAdd }}
    />
)