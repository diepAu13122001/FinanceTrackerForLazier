import { useState } from 'react'
import { DS } from '@/lib/design-system'
import { DailyBarChart } from '@/components/charts/DailyBarChart'
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart'
import { PlanGate } from '@/components/shared/PlanGate'

// ─── Filter riêng cho từng chart ─────────────────────────────────────────────

const MONTHS = [
    { value: 1, label: 'Tháng 1' }, { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' }, { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' }, { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' }, { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' }, { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' }, { value: 12, label: 'Tháng 12' },
]

const QUARTERS = [
    { value: 1, label: 'Quý 1 (T1-T3)' },
    { value: 2, label: 'Quý 2 (T4-T6)' },
    { value: 3, label: 'Quý 3 (T7-T9)' },
    { value: 4, label: 'Quý 4 (T10-T12)' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2]

type DailyFilterMode = 'month' | 'quarter'

const AnalyticsPage = () => {
    const now = new Date()

    // ── Filter cho DailyBarChart ────────────────────────────────────────────────
    const [dailyMode, setDailyMode] = useState<DailyFilterMode>('month')
    const [dailyYear, setDailyYear] = useState(now.getFullYear())
    const [dailyMonth, setDailyMonth] = useState(now.getMonth() + 1)
    const [dailyQuarter, setDailyQuarter] = useState(Math.ceil((now.getMonth() + 1) / 3))

    // ── Filter cho MonthlyTrendChart ────────────────────────────────────────────
    const [trendYear, setTrendYear] = useState(now.getFullYear())

    // Tính startMonth/endMonth khi filter theo quý
    const quarterToMonths = (q: number) => ({
        startMonth: (q - 1) * 3 + 1,
        endMonth: q * 3,
    })

    // Props truyền vào DailyBarChart
    const dailyChartParams = dailyMode === 'month'
        ? { year: dailyYear, month: dailyMonth }
        : { year: dailyYear, ...quarterToMonths(dailyQuarter) }
    return (
        <PlanGate requires="PLUS">
            <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8">

                <div>
                    <h1 className={DS.heading1}>Phân tích</h1>
                    <p className={DS.muted}>Xu hướng thu chi của bạn</p>
                </div>

                {/* ── Chart 1: Thu chi theo ngày ──────────────────────────────────── */}
                <div className="flex flex-col gap-3">
                    <div>
                        <h2 className={DS.heading2}>Thu chi theo ngày</h2>
                        <p className={DS.muted}>So sánh thu và chi từng ngày trong tháng/quý</p>
                    </div>

                    {/* Filter: Tháng hoặc Quý */}
                    <div className="flex flex-wrap items-center gap-2">

                        {/* Toggle month/quarter */}
                        <div className="flex p-1 bg-surface-muted rounded-lg">
                            {([
                                { key: 'month', label: 'Theo tháng' },
                                { key: 'quarter', label: 'Theo quý' },
                            ] as { key: DailyFilterMode; label: string }[]).map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setDailyMode(tab.key)}
                                    className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                    ${dailyMode === tab.key
                                            ? 'bg-white text-text-primary shadow-sm'
                                            : 'text-text-muted hover:text-text-primary'
                                        }
                  `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Chọn năm */}
                        <select
                            value={dailyYear}
                            onChange={e => setDailyYear(Number(e.target.value))}
                            className={`${DS.inputBase} w-24`}
                        >
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>

                        {/* Chọn tháng */}
                        {dailyMode === 'month' && (
                            <select
                                value={dailyMonth}
                                onChange={e => setDailyMonth(Number(e.target.value))}
                                className={`${DS.inputBase} w-28`}
                            >
                                {MONTHS.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        )}

                        {/* Chọn quý */}
                        {dailyMode === 'quarter' && (
                            <select
                                value={dailyQuarter}
                                onChange={e => setDailyQuarter(Number(e.target.value))}
                                className={`${DS.inputBase} w-40`}
                            >
                                {QUARTERS.map(q => (
                                    <option key={q.value} value={q.value}>{q.label}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <DailyBarChart {...dailyChartParams} />
                </div>

                {/* ── Chart 2: Xu hướng theo tháng ────────────────────────────────── */}
                <div className="flex flex-col gap-3">
                    <div>
                        <h2 className={DS.heading2}>Xu hướng theo tháng</h2>
                        <p className={DS.muted}>Tổng thu chi mỗi tháng trong năm</p>
                    </div>

                    {/* Filter: chỉ chọn năm */}
                    <div className="flex items-center gap-2">
                        <span className={DS.label}>Năm:</span>
                        <select
                            value={trendYear}
                            onChange={e => setTrendYear(Number(e.target.value))}
                            className={`${DS.inputBase} w-24`}
                        >
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    <MonthlyTrendChart year={trendYear} />
                </div>

            </div>
        </PlanGate>
    )
}

export default AnalyticsPage