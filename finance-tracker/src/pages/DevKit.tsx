import { Button, Input, Card, PlanGate, UpgradePrompt, LockedBadge } from '@/components/shared'
import { usePlan } from '@/hooks/usePlan'
import { useNavigate } from 'react-router-dom'
import { Search, Mail, Plus, Download } from 'lucide-react'
import { DS } from '@/lib/design-system'

// ─── Helper component tạo section có tiêu đề ─────────────────────────────────

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-4">
        <div className="border-b border-surface-border pb-2">
            <h2 className={DS.heading2}>{title}</h2>
        </div>
        {children}
    </div>
)

// ─── Component chính ──────────────────────────────────────────────────────────

const DevKit = () => {
    const navigate = useNavigate()
    const { plan, isFree, isPremium } = usePlan()

    return (
        <div className="p-8 flex flex-col gap-12 max-w-2xl mx-auto">

            {/* Header */}
            <div>
                <h1 className={DS.heading1}>🛠 DevKit</h1>
                <p className={DS.muted}>
                    Plan hiện tại: <strong>{plan}</strong> —
                    đổi <code>MOCK_PLAN</code> trong <code>usePlan.ts</code> để test
                </p>
            </div>

            {/* ── SECTION 1: Buttons ───────────────────────────────────────────────── */}
            <Section title="Buttons — Variants">
                <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="premium">💎 Premium</Button>
                </div>
            </Section>

            <Section title="Buttons — Sizes">
                <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Nhỏ</Button>
                    <Button size="md">Vừa</Button>
                    <Button size="lg">Lớn</Button>
                </div>
            </Section>

            <Section title="Buttons — States">
                <div className="flex flex-wrap gap-3">
                    <Button loading>Đang lưu...</Button>
                    <Button disabled>Disabled</Button>
                    <Button leftIcon={<Plus size={16} />}>Thêm mới</Button>
                    <Button rightIcon={<Download size={16} />} variant="ghost">Xuất CSV</Button>
                </div>
            </Section>

            {/* ── SECTION 2: Inputs ────────────────────────────────────────────────── */}
            <Section title="Inputs">
                <Input
                    label="Email"
                    type="email"
                    placeholder="ban@email.com"
                />
                <Input
                    label="Mật khẩu"
                    type="password"
                    error="Mật khẩu phải có ít nhất 8 ký tự"
                />
                <Input
                    label="Số tiền"
                    type="number"
                    helperText="Nhập số tiền bằng VND, ví dụ: 45000"
                />
                <Input
                    label="Tên"
                    required
                />
                <Input
                    label="Tìm kiếm"
                    leftIcon={<Search size={16} />}
                    placeholder="Tìm giao dịch..."
                />
                <Input
                    label="Email có icon"
                    leftIcon={<Mail size={16} />}
                    type="email"
                    placeholder="ban@email.com"
                />
            </Section>

            {/* ── SECTION 3: Cards ─────────────────────────────────────────────────── */}
            <Section title="Cards">
                <Card>
                    <h3 className={DS.heading3}>Card Default</h3>
                    <p className={DS.muted}>Tổng chi tiêu tháng này: 2.450.000 ₫</p>
                </Card>

                <Card variant="elevated">
                    <h3 className={DS.heading3}>Card Elevated</h3>
                    <p className={DS.muted}>Dùng cho hero section hoặc modal</p>
                </Card>

                <Card
                    variant="locked"
                    requiredPlan="PLUS"
                    onUpgrade={() => navigate('/pricing')}
                >
                    <h3 className={DS.heading3}>Nội dung Plus</h3>
                    <p className={DS.muted}>Biểu đồ danh mục chi tiêu</p>
                </Card>

                <Card
                    variant="locked"
                    requiredPlan="PREMIUM"
                    onUpgrade={() => navigate('/pricing')}
                >
                    <h3 className={DS.heading3}>Nội dung Premium</h3>
                    <p className={DS.muted}>Theo dõi đồ dùng gia đình</p>
                </Card>
            </Section>

            {/* ── SECTION 4: Plan Gating ───────────────────────────────────────────── */}
            <Section title="PlanGate">
                <PlanGate requires="PLUS">
                    <Card>
                        <p className="text-success-600 font-medium">
                            ✅ Bạn thấy được card này = đang dùng gói Plus trở lên
                        </p>
                    </Card>
                </PlanGate>

                <PlanGate requires="PREMIUM">
                    <Card>
                        <p className="text-amber-600 font-medium">
                            ✅ Bạn thấy được card này = đang dùng gói Premium
                        </p>
                    </Card>
                </PlanGate>

                <PlanGate
                    requires="PLUS"
                    fallback={
                        <p className={DS.muted}>
                            🔒 Fallback tùy chỉnh — thay vì UpgradePrompt mặc định
                        </p>
                    }
                >
                    <p className="text-success-600">Nội dung Plus với fallback tùy chỉnh</p>
                </PlanGate>
            </Section>

            {/* ── SECTION 5: UpgradePrompt ─────────────────────────────────────────── */}
            <Section title="UpgradePrompt — Card">
                <UpgradePrompt requiredPlan="PLUS" layout="card" />
                <UpgradePrompt requiredPlan="PREMIUM" layout="card" />
            </Section>

            <Section title="UpgradePrompt — Inline">
                <UpgradePrompt requiredPlan="PLUS" layout="inline" />
                <UpgradePrompt requiredPlan="PREMIUM" layout="inline" />
            </Section>

            {/* ── SECTION 6: LockedBadge ───────────────────────────────────────────── */}
            <Section title="LockedBadge">
                <div className="flex items-center gap-3">
                    <LockedBadge requiredPlan="PLUS" />
                    <LockedBadge requiredPlan="PREMIUM" />
                </div>
            </Section>

        </div>
    )
}

export default DevKit;