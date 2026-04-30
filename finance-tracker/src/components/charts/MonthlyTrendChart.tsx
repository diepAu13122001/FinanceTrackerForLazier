import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { DS } from '@/lib/design-system'
import { useMonthlyChart } from '@/hooks/useCharts'
import { formatShortVND, formatVND } from '@/utils/format'

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null

    const balance = (payload.find((p: any) => p.dataKey === 'income')?.value ?? 0)
        - (payload.find((p: any) => p.dataKey === 'expense')?.value ?? 0)

    return (
        <div className={`${DS.card} !p-3 min-w-40 shadow-lg`}>
            <p className={`${DS.label} mb-2`}>{label}</p>
            {payload.map((entry: any) => (
                <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className={DS.muted}>
                            {entry.dataKey === 'income' ? 'Thu' : 'Chi'}
                        </span>
                    </div>
                    <span className="text-sm font-medium">{formatVND(entry.value)}</span>
                </div>
            ))}
            {/* Số dư tháng */}
            <div className={`border-t border-surface-border mt-2 pt-2 flex justify-between`}>
                <span className={DS.muted}>Số dư</span>
                <span className={`text-sm font-semibold ${balance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {balance >= 0 ? '+' : ''}{formatVND(balance)}
                </span>
            </div>
        </div>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface MonthlyTrendChartProps {
    year?: number
}

export const MonthlyTrendChart = ({ year }: MonthlyTrendChartProps) => {
    const { data, isLoading } = useMonthlyChart(year)

    if (isLoading) {
        return (
            <div className={DS.card}>
                <div className="h-4 w-40 bg-surface-muted rounded animate-pulse mb-4" />
                <div className="h-48 bg-surface-muted rounded-lg animate-pulse" />
            </div>
        )
    }

    return (
        <div className={DS.card}>
            <h3 className={`${DS.heading3} mb-4`}>Xu hướng thu chi theo tháng</h3>

            <ResponsiveContainer width="100%" height={220}>
                <LineChart
                    data={data}
                    margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

                    <XAxis
                        dataKey="label"
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

                    {/* Đường tham chiếu 0 */}
                    <ReferenceLine y={0} stroke="#e2e8f0" />

                    <Tooltip content={<CustomTooltip />} />

                    <Legend
                        formatter={(value) => value === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                        wrapperStyle={{ fontSize: 12 }}
                    />

                    <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#22c55e' }}
                        activeDot={{ r: 5 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#ef4444' }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}