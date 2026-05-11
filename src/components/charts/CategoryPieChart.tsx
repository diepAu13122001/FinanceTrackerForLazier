import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { DS } from '@/lib/design-system'
import { formatVND } from '@/utils/format'

export interface CategoryChartData {
    categoryId: string | null
    categoryName: string
    categoryColor: string
    totalAmount: number
    transactionCount: number
    percentage: number
}

interface CategoryPieChartProps {
    data: CategoryChartData[]
    title?: string
    isLoading?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const item = payload[0].payload as CategoryChartData
    return (
        <div className="bg-surface rounded-xl shadow-xl border border-surface-border px-4 py-3 z-50">
            <div className="flex items-center gap-2 mb-1.5">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.categoryColor }} />
                <span className="font-bold text-sm text-text-primary">{item.categoryName}</span>
            </div>
            <div className="text-xs text-text-muted mt-0.5">
                {item.percentage.toFixed(1)}% · {item.transactionCount} giao dịch
            </div>
            <div className="text-sm font-semibold text-text-primary">{formatVND(item.totalAmount)}</div>
        </div>
    )
}

export const CategoryPieChart = ({
    data,
    title = 'Phân bổ chi tiêu theo danh mục',
    isLoading = false,
}: CategoryPieChartProps) => {

    const sorted = [...(data ?? [])].sort((a, b) => b.totalAmount - a.totalAmount)
    const total = sorted.reduce((s, d) => s + d.totalAmount, 0)

    if (isLoading) {
        return (
            <div className={DS.card}>
                <div className="animate-pulse flex flex-col gap-4">
                    <div className="h-5 bg-surface-muted rounded w-1/2" />
                    <div className="flex gap-4 items-center">
                        <div className="w-32 h-32 rounded-full bg-surface-muted flex-shrink-0" />
                        <div className="flex-1 flex flex-col gap-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-6 bg-surface-muted rounded-full" />)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!sorted || sorted.length === 0) {
        return (
            <div className={DS.card}>
                <h3 className={DS.heading3}>{title}</h3>
                <div className="flex flex-col items-center justify-center py-10 text-text-muted gap-2">
                    <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center">
                        <span className="text-xl">📊</span>
                    </div>
                    <p className="text-sm">Chưa có dữ liệu</p>
                    <p className="text-xs">Thêm giao dịch và phân loại để xem biểu đồ</p>
                </div>
            </div>
        )
    }

    return (
        <div className={DS.card}>
            <h3 className={`${DS.heading3} mb-4`}>{title}</h3>

            <div className="flex flex-col sm:flex-row gap-6 items-start">

                {/* ── Donut chart + center text ── */}
                <div className="relative flex-shrink-0 w-44 h-44 mx-auto sm:mx-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip
                                content={<CustomTooltip />}
                                allowEscapeViewBox={{ x: true, y: true }}
                                offset={16}
                                wrapperStyle={{
                                    zIndex: 9999,
                                    pointerEvents: 'none',
                                }} />
                            <Pie
                                data={sorted}
                                dataKey="totalAmount"
                                nameKey="categoryName"
                                cx="50%" cy="50%"
                                innerRadius={52}
                                outerRadius={82}
                                paddingAngle={2}
                                strokeWidth={0}
                            >
                                {sorted.map((entry, i) => (
                                    <Cell key={`cell-${i}`} fill={entry.categoryColor} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center text — tổng amount */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs text-text-muted">Tổng</span>
                        <span className="text-sm font-bold text-text-primary leading-tight">
                            {formatVND(total).replace(' ₫', '')}
                        </span>
                        <span className="text-xs text-text-muted">₫</span>
                    </div>
                </div>

                {/* ── Legend: horizontal bars theo hình mẫu ── */}
                <div className="flex-1 flex flex-col gap-3 min-w-0 w-full">
                    {sorted.map((item, index) => (
                        <div key={item.categoryId ?? 'uncategorized'} className="flex flex-col gap-1">
                            {/* Row 1: rank + name + amount */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-text-muted w-4 flex-shrink-0 font-mono">
                                    {index + 1}.
                                </span>
                                <span
                                    className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: item.categoryColor }}
                                />
                                {/* Tên — truncate nếu quá dài */}
                                <span
                                    className="flex-1 text-sm font-medium text-text-primary truncate"
                                    title={item.categoryName}
                                >
                                    {item.categoryName}
                                </span>
                                <div className="flex-shrink-0 text-right">
                                    <span className="text-sm font-bold text-text-primary">
                                        {formatVND(item.totalAmount)}
                                    </span>
                                </div>
                            </div>

                            {/* Row 2: progress bar + % */}
                            <div className="flex items-center gap-2 pl-6">
                                {/* Bar track */}
                                <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${item.percentage}%`,
                                            backgroundColor: item.categoryColor,
                                            opacity: 0.85,
                                        }}
                                    />
                                </div>
                                {/* % text */}
                                <span
                                    className="flex-shrink-0 text-xs font-bold w-10 text-right"
                                    style={{ color: item.categoryColor }}
                                >
                                    {item.percentage.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}