import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { DS } from '@/lib/design-system'
import { useDailyChart } from '@/hooks/useCharts'
import { formatShortVND, formatVND } from '@/utils/format'
import { ChartSkeleton } from '@/components/shared/Skeleton'
import { NoDataChartEmptyState } from '@/components/shared/EmptyState'

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null

    const income = payload.find((p: any) => p.dataKey === 'income')?.value ?? 0
    const expense = payload.find((p: any) => p.dataKey === 'expense')?.value ?? 0

    return (
        <div className={`${DS.card} !p-3 min-w-48 shadow-lg`}>
            <p className={`${DS.label} mb-3`}>{label}</p>

            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-success-500" />
                        <span className="text-xs text-text-muted">Thu nhập</span>
                    </div>
                    <span className="text-sm font-semibold text-success-600">
                        +{formatVND(income)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-danger-500" />
                        <span className="text-xs text-text-muted">Chi tiêu</span>
                    </div>
                    <span className="text-sm font-semibold text-danger-600">
                        -{formatVND(expense)}
                    </span>
                </div>

                {/* <div className="border-t border-surface-border pt-1.5 mt-0.5 flex justify-between">
                    <span className="text-xs text-text-muted">Số dư tháng</span>
                    <span className={`text-sm font-bold ${balance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        {balance >= 0 ? '+' : ''}{formatVND(balance)}
                    </span>
                </div> */}
            </div>
        </div>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface DailyBarChartProps {
    year?: number
    month?: number
    startMonth?: number; // dùng khi filter theo quý
    endMonth?: number;
}

export const DailyBarChart = ({ year, month, startMonth, endMonth
}: DailyBarChartProps) => {
    const { data, isLoading } = useDailyChart({ year, month, startMonth, endMonth })

    // Format label trục X — chỉ hiện số ngày
    const formatXAxis = (dateStr: string) => dateStr.split('-')[2]

    if (isLoading) return <ChartSkeleton />

    if (!data || data.length === 0) {
        return (
            <div className={DS.card}>
                <NoDataChartEmptyState />
            </div>
        )
    }

    return (
        <div className={DS.card}>
            <h3 className={`${DS.heading3} mb-4`}>Thu chi theo ngày</h3>

            <ResponsiveContainer width="100%" height={220}>
                <BarChart
                    data={data}
                    margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                    barCategoryGap="30%"
                    barGap={2}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

                    <XAxis
                        dataKey="date"
                        tickFormatter={formatXAxis}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis
                        tickFormatter={formatShortVND}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />

                    <Legend
                        formatter={(value) => value === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                        wrapperStyle={{ fontSize: 12 }}
                    />

                    <Bar
                        dataKey="income"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={24}
                    />
                    <Bar
                        dataKey="expense"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={24}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}