import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PlanGate } from '@/components/shared/PlanGate'
import { usePlan } from '@/hooks/usePlan'
import type { PlanId } from '@/types/plans'

// Mock usePlan hook
vi.mock('@/hooks/usePlan')

const mockPlan = (planId: PlanId) => {
    vi.mocked(usePlan).mockReturnValue({
        plan: planId,
        isFree: planId === 'FREE',
        isPlus: ['PLUS', 'PREMIUM'].includes(planId),
        isPremium: planId === 'PREMIUM',
        canUse: (feature) => {
            const plusFeatures = ['categories', 'ai_assistant', 'csv_export']
            const premiumFeatures = ['household_tracker', 'expiry_notifications']
            if (premiumFeatures.includes(feature)) return planId === 'PREMIUM'
            if (plusFeatures.includes(feature)) return ['PLUS', 'PREMIUM'].includes(planId)
            return true
        },
        hasLevel: (required) => {
            const levels: Record<PlanId, number> = { FREE: 1, PLUS: 2, PREMIUM: 3 }
            return levels[planId] >= levels[required]
        },
        planConfig: {} as any,
    })
}

// Helper render với Router context
const renderWithRouter = (ui: React.ReactElement) =>
    render(<MemoryRouter>{ui}</MemoryRouter>)

describe('PlanGate', () => {

    describe('Free user', () => {
        it('KHÔNG hiển thị children khi requires PLUS', () => {
            mockPlan('FREE')
            renderWithRouter(
                <PlanGate requires="PLUS">
                    <div>Nội dung Plus</div>
                </PlanGate>
            )
            expect(screen.queryByText('Nội dung Plus')).not.toBeInTheDocument()
        })

        it('KHÔNG hiển thị children khi requires PREMIUM', () => {
            mockPlan('FREE')
            renderWithRouter(
                <PlanGate requires="PREMIUM">
                    <div>Nội dung Premium</div>
                </PlanGate>
            )
            expect(screen.queryByText('Nội dung Premium')).not.toBeInTheDocument()
        })

        it('hiển thị fallback tùy chỉnh thay vì children', () => {
            mockPlan('FREE')
            renderWithRouter(
                <PlanGate
                    requires="PLUS"
                    fallback={<div>Cần nâng cấp</div>}
                >
                    <div>Nội dung Plus</div>
                </PlanGate>
            )
            expect(screen.getByText('Cần nâng cấp')).toBeInTheDocument()
            expect(screen.queryByText('Nội dung Plus')).not.toBeInTheDocument()
        })
    })

    describe('Plus user', () => {
        it('hiển thị children khi requires PLUS', () => {
            mockPlan('PLUS')
            renderWithRouter(
                <PlanGate requires="PLUS">
                    <div>Nội dung Plus</div>
                </PlanGate>
            )
            expect(screen.getByText('Nội dung Plus')).toBeInTheDocument()
        })

        it('KHÔNG hiển thị children khi requires PREMIUM', () => {
            mockPlan('PLUS')
            renderWithRouter(
                <PlanGate requires="PREMIUM">
                    <div>Nội dung Premium</div>
                </PlanGate>
            )
            expect(screen.queryByText('Nội dung Premium')).not.toBeInTheDocument()
        })
    })

    describe('Premium user', () => {
        it('hiển thị children khi requires PLUS', () => {
            mockPlan('PREMIUM')
            renderWithRouter(
                <PlanGate requires="PLUS">
                    <div>Nội dung Plus</div>
                </PlanGate>
            )
            expect(screen.getByText('Nội dung Plus')).toBeInTheDocument()
        })

        it('hiển thị children khi requires PREMIUM', () => {
            mockPlan('PREMIUM')
            renderWithRouter(
                <PlanGate requires="PREMIUM">
                    <div>Nội dung Premium</div>
                </PlanGate>
            )
            expect(screen.getByText('Nội dung Premium')).toBeInTheDocument()
        })

        it('không hiển thị upgrade prompt khi đủ quyền', () => {
            mockPlan('PREMIUM')
            renderWithRouter(
                <PlanGate requires="PREMIUM">
                    <div>Nội dung Premium</div>
                </PlanGate>
            )
            expect(screen.queryByText(/Nâng cấp/i)).not.toBeInTheDocument()
        })
    })
})