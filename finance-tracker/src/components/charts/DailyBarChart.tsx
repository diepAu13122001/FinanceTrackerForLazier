import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { DS } from '@/lib/design-system'
import { useDailyChart } from '@/hooks/useCharts'
import { formatShortVND, formatVND } from '@/utils/format'
import { useState } from 'react'

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null

    const day = label?.split('-')[2]  // "2026-01-14" → "14"

    return (
        <div className={`${DS.card} !p-3 min-w-36 shadow-lg`}>
            <p className={`${DS.label} mb-2`}>Ngày {day}</p>
            {payload.map((entry: any) => (
                <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className={DS.muted}>
                            {entry.dataKey === 'income' ? 'Thu' : 'Chi'}
                        </span>
                    </div>
                    <span className="text-sm font-medium">
                        {formatVND(entry.value)}
                    </span>
                </div>
            ))}
        </div>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface DailyBarChartProps {
    year?: number
    month?: number
}

export const DailyBarChart = ({ year, month }: DailyBarChartProps) => {
    const { data, isLoading } = useDailyChart(year, month)

    // Format label trục X — chỉ hiện số ngày
    const formatXAxis = (dateStr: string) => dateStr.split('-')[2]

    if (isLoading) {
        return (
            <div className={DS.card}>
                <div className="h-4 w-40 bg-surface-muted rounded animate-pulse mb-4" />
                <div className="h-48 bg-surface-muted rounded-lg animate-pulse" />
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className={`${DS.card} flex flex-col items-center justify-center h-48 gap-2`}>
                <span className="text-3xl">📊</span>
                <p className={DS.muted}>Chưa có dữ liệu trong kỳ này</p>
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