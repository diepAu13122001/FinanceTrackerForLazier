import { DS } from '@/lib/design-system'
import type { SummaryParams } from '@/services/transactionService'

interface PeriodSelectorProps {
    params: SummaryParams
    onChange: (params: SummaryParams) => void
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2]
const MONTHS = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
]

type ViewMode = 'month' | 'quarter' | 'year'

export const PeriodSelector = ({ params, onChange }: PeriodSelectorProps) => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    // Xác định mode hiện tại
    const mode: ViewMode = params.quarter
        ? 'quarter'
        : params.month
            ? 'month'
            : 'year'

    const selectedYear = params.year ?? currentYear

    return (
        <div className="flex flex-wrap items-center gap-2">

            {/* Tab chọn mode */}
            <div className="flex p-1 bg-surface-muted rounded-lg">
                {([
                    { key: 'month', label: 'Tháng' },
                    { key: 'quarter', label: 'Quý' },
                    { key: 'year', label: 'Năm' },
                ] as { key: ViewMode; label: string }[]).map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => {
                            if (tab.key === 'month') {
                                onChange({ year: selectedYear, month: currentMonth })
                            } else if (tab.key === 'quarter') {
                                const q = Math.ceil(currentMonth / 3)
                                onChange({ year: selectedYear, quarter: q })
                            } else {
                                onChange({ year: selectedYear })
                            }
                        }}
                        className={`
              px-3 py-1 rounded-md text-sm font-medium transition-colors
              ${mode === tab.key
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
                value={selectedYear}
                onChange={e => onChange({ ...params, year: Number(e.target.value) })}
                className={DS.inputBase + ' w-28'}
            >
                {YEARS.map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>

            {/* Chọn tháng — chỉ hiện khi mode = month */}
            {mode === 'month' && (
                <select
                    value={params.month ?? currentMonth}
                    onChange={e => onChange({ year: selectedYear, month: Number(e.target.value) })}
                    className={DS.inputBase + ' w-28'}
                >
                    {MONTHS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
            )}

            {/* Chọn quý — chỉ hiện khi mode = quarter */}
            {mode === 'quarter' && (
                <select
                    value={params.quarter ?? 1}
                    onChange={e => onChange({ year: selectedYear, quarter: Number(e.target.value) })}
                    className={DS.inputBase + ' w-24'}
                >
                    {[1, 2, 3, 4].map(q => (
                        <option key={q} value={q}>Quý {q}</option>
                    ))}
                </select>
            )}

        </div>
    )
}