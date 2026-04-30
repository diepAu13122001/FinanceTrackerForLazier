import { useState } from 'react'
import { DS } from '@/lib/design-system'
import { DailyBarChart } from '@/components/charts/DailyBarChart'
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart'
import { PeriodSelector } from '@/components/transactions/PeriodSelector'
import { PlanGate } from '@/components/shared/PlanGate'
import type { SummaryParams } from '@/services/transactionService'

const AnalyticsPage = () => {
    const [params, setParams] = useState<SummaryParams>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    })

    const currentYear = params.year ?? new Date().getFullYear()

    return (
        <PlanGate requires="PLUS">
            <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">

                <div>
                    <h1 className={DS.heading1}>Phân tích</h1>
                    <p className={DS.muted}>Xu hướng thu chi của bạn</p>
                </div>

                {/* Selector cho bar chart theo tháng */}
                <div className="flex flex-col gap-4">
                    <PeriodSelector params={params} onChange={setParams} />
                    <DailyBarChart year={params.year} month={params.month} />
                </div>

                {/* Trend chart theo năm */}
                <MonthlyTrendChart year={currentYear} />

            </div>
        </PlanGate>
    )
}

export default AnalyticsPage