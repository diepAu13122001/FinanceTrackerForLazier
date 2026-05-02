import { DS } from '@/lib/design-system'
import { PLAN_CONFIG } from '@/types/plans'
import type { PlanId } from '@/types/plans'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface UpgradePromptProps {
  requiredPlan: Exclude<PlanId, 'FREE'>
  // Tùy chỉnh nội dung nếu muốn
  title?:       string
  description?: string
  // Layout: 'card' = hộp đứng riêng, 'inline' = nhỏ gọn nằm trong UI
  layout?:      'card' | 'inline'
}

// ─── Nội dung mặc định theo gói ───────────────────────────────────────────────

const DEFAULT_CONTENT: Record<Exclude<PlanId, 'FREE'>, { title: string; description: string }> = {
  PLUS: {
    title:       'Tính năng này cần gói Plus',
    description: 'Nâng cấp miễn phí để mở khóa danh mục, mục tiêu tài chính, AI và nhiều hơn nữa.',
  },
  PREMIUM: {
    title:       'Tính năng này cần gói Premium',
    description: 'Nâng cấp lên Premium để dùng theo dõi đồ dùng, AI không giới hạn và thông báo hết hạn.',
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export const UpgradePrompt = ({
  requiredPlan,
  title,
  description,
  layout = 'card',
}: UpgradePromptProps) => {
  const navigate    = useNavigate()
  const config      = PLAN_CONFIG[requiredPlan]
  const content     = DEFAULT_CONTENT[requiredPlan]
  const isPremium   = requiredPlan === 'PREMIUM'

  const displayTitle       = title       ?? content.title
  const displayDescription = description ?? content.description

  // ── Layout inline: dùng trong navbar, tooltip nhỏ ──
  if (layout === 'inline') {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-muted border border-surface-border">
        <Lock size={16} className="text-text-muted shrink-0" />
        <div className="flex-1 min-w-0">
          <p className={`${DS.label} truncate`}>{displayTitle}</p>
        </div>
        <button
          onClick={() => navigate('/pricing')}
          className={isPremium ? DS.btnPremium : DS.btnPrimary}
          style={{ padding: '4px 12px', fontSize: '12px' }}
        >
          Nâng cấp
        </button>
      </div>
    )
  }

  // ── Layout card: dùng trong trang, modal ──
  return (
    <div className={`${DS.card} flex flex-col items-center text-center gap-4`}>

      {/* Icon khóa */}
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center
        ${isPremium ? 'bg-amber-50' : 'bg-primary-50'}
      `}>
        <Lock
          size={22}
          className={isPremium ? 'text-amber-500' : 'text-primary-500'}
        />
      </div>

      {/* Nội dung */}
      <div className="flex flex-col gap-1">
        <h3 className={DS.heading3}>{displayTitle}</h3>
        <p className={DS.muted}>{displayDescription}</p>
      </div>

      {/* Giá */}
      {isPremium && (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-amber-600">
            {config.priceVnd.toLocaleString('vi-VN')}₫
          </span>
          <span className={DS.muted}>/năm</span>
          <span className={`${DS.muted} text-xs`}>
            (~{Math.round(config.priceVnd / 12).toLocaleString('vi-VN')}₫/tháng)
          </span>
        </div>
      )}

      {/* Nút hành động */}
      <button
        onClick={() => navigate('/pricing')}
        className={isPremium ? DS.btnPremium : DS.btnPrimary}
      >
        {isPremium ? '💎 Nâng cấp Premium' : '⭐ Nâng cấp Plus miễn phí'}
      </button>

      {/* Link phụ */}
      <button
        onClick={() => navigate('/pricing')}
        className={`${DS.muted} text-xs hover:text-text-secondary underline underline-offset-2`}
      >
        Xem so sánh các gói
      </button>

    </div>
  )
}