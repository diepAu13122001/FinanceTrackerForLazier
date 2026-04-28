import { DS } from '@/lib/design-system'
import { Check, X, Minus } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type FeatureAvailability = boolean | string | number
// boolean → check/x
// string  → hiển thị text ("20 tin nhắn/tháng")
// number  → hiển thị số (50)

interface FeatureRowProps {
    label: string
    free: FeatureAvailability
    plus: FeatureAvailability
    premium: FeatureAvailability
    highlight?: boolean  // highlight hàng quan trọng
}

// ─── Helper render từng ô ────────────────────────────────────────────────────

const Cell = ({ value }: { value: FeatureAvailability }) => {
    if (value === true) {
        return <Check size={18} className="text-success-500 mx-auto" />
    }
    if (value === false) {
        return <X size={18} className="text-text-muted mx-auto" />
    }
    if (value === 0) {
        return <Minus size={18} className="text-text-muted mx-auto" />
    }
    return (
        <span className="text-sm text-text-primary font-medium">{value}</span>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FeatureRow = ({
    label,
    free,
    plus,
    premium,
    highlight = false,
}: FeatureRowProps) => (
    <div className={`
    grid grid-cols-4 items-center gap-2 px-4 py-3 rounded-lg
    ${highlight ? 'bg-primary-50' : 'hover:bg-surface-muted'}
    transition-colors
  `}>
        <span className={`${DS.body} col-span-1`}>{label}</span>
        <div className="text-center"><Cell value={free} /></div>
        <div className="text-center"><Cell value={plus} /></div>
        <div className="text-center"><Cell value={premium} /></div>
    </div>
)