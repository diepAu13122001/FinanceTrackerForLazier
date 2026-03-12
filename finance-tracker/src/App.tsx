import { PlanGate, UpgradePrompt, LockedBadge, Card } from './components/shared'

function App() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Test 1: PlanGate — đổi MOCK_PLAN trong usePlan.ts để xem thay đổi */}
      <PlanGate requires="PLUS">
        <Card><p>✅ Bạn thấy được card này = đang dùng gói Plus trở lên</p></Card>
      </PlanGate>

      {/* Test 2: UpgradePrompt trực tiếp */}
      <UpgradePrompt requiredPlan="PLUS" />
      <UpgradePrompt requiredPlan="PREMIUM" />

      {/* Test 3: Inline layout */}
      <UpgradePrompt requiredPlan="PLUS" layout="inline" />

      {/* Test 4: LockedBadge */}
      <div style={{ display: 'flex', gap: 8 }}>
        <LockedBadge requiredPlan="PLUS" />
        <LockedBadge requiredPlan="PREMIUM" />
      </div>

      {/* Test 5: PlanGate với fallback tùy chỉnh */}
      <PlanGate
        requires="PREMIUM"
        fallback={<p style={{ color: 'gray' }}>🔒 Cần Premium để xem phần này</p>}
      >
        <p>Nội dung Premium</p>
      </PlanGate>

    </div>
  )
}

export default App;