import { useState } from 'react'
import { Plus, Wallet, CreditCard } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { DS } from '@/lib/design-system'
import { WalletCard } from '@/components/wallets/WalletCard'
import { WalletFormModal } from '@/components/wallets/WalletFormModal'
import { animations } from '@/lib/animations'
import { useWallets } from '@/hooks/useWallets'
import type { WalletResponse, WalletType } from '@/types/wallet'
import { Skeleton } from '@/components/shared/Skeleton'
import { formatVND } from '@/utils/format'
import { usePlan } from '@/hooks/usePlan'
import { UpgradePrompt } from '@/components/shared'

type WalletTab = 'NORMAL' | 'DEBT'

const WalletsPage = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<WalletResponse | null>(null)
  const [activeTab, setActiveTab] = useState<WalletTab>('NORMAL')
  const [defaultType, setDefaultType] = useState<WalletType>('NORMAL')

  const { isPlus } = usePlan()
  const { data: allWallets, isLoading } = useWallets(isPlus)

  if (!isPlus) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className={DS.heading1}>Nguồn tiền</h1>
        <div className="mt-6"><UpgradePrompt requiredPlan="PLUS" layout="card" /></div>
      </div>
    )
  }

  const activeWallets = allWallets?.filter(w => w.status === 'ACTIVE') ?? []
  const normalWallets = activeWallets.filter(w => w.type === 'NORMAL')
  const debtWallets = activeWallets.filter(w => w.type === 'DEBT')

  const totalBalance = normalWallets.reduce((s, w) => s + w.balance, 0)
  const totalDebt = debtWallets.reduce((s, w) => s + w.currentAmount, 0)
  const netWorth = totalBalance - totalDebt
  const overLimitDebts = debtWallets.filter(w => w.overLimit).length

  const openCreate = (type: WalletType) => { setEditing(null); setDefaultType(type); setModalOpen(true) }
  const openEdit = (w: WalletResponse) => { setEditing(w); setModalOpen(true) }

  const TABS = [
    { key: 'NORMAL' as WalletTab, label: 'Tài khoản', icon: Wallet, count: normalWallets.length },
    { key: 'DEBT' as WalletTab, label: 'Khoản nợ', icon: CreditCard, count: debtWallets.length },
  ]

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">

      <div className={`flex items-center justify-between ${animations.fadeInUp}`}>
        <div>
          <h1 className={DS.heading1}>Nguồn tiền</h1>
          <p className={DS.muted}>Quản lý ví và khoản nợ của bạn</p>
        </div>
        <div className="hidden md:block">
          <Button leftIcon={<Plus size={16} />} onClick={() => openCreate(activeTab)}>Thêm mới</Button>
        </div>
      </div>

      {/* Debt danger banner */}
      {overLimitDebts > 0 && (
        <div className="bg-danger-50 border-2 border-danger-300 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-sm font-bold text-danger-700">{overLimitDebts} khoản nợ vượt hạn mức!</p>
            <p className="text-xs text-danger-600 mt-0.5">Hãy ưu tiên trả nợ ngay.</p>
          </div>
        </div>
      )}

      {/* Summary */}
      {!isLoading && activeWallets.length > 0 && (
        <div className={DS.card}>
          <div className="grid grid-cols-3 gap-4 text-center divide-x divide-surface-border">
            <div>
              <div className="text-xs text-text-muted mb-1">Tổng số dư</div>
              <div className={`text-base font-bold ${totalBalance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {formatVND(Math.abs(totalBalance))}
              </div>
            </div>
            <div>
              <div className="text-xs text-text-muted mb-1">Dư nợ</div>
              <div className="text-base font-bold text-danger-600">{formatVND(totalDebt)}</div>
            </div>
            <div>
              <div className="text-xs text-text-muted mb-1">Tài sản ròng</div>
              <div className={`text-base font-bold ${netWorth >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {netWorth < 0 ? '−' : ''}{formatVND(Math.abs(netWorth))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-muted rounded-xl">
        {TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
              <Icon size={15} />
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-surface-border text-text-muted'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {isLoading && <div className="flex flex-col gap-3">{[1,2].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>}

      {activeTab === 'NORMAL' && !isLoading && (
        normalWallets.length === 0
          ? <EmptyState title="Chưa có tài khoản nào" desc="Tạo ví tiền mặt, ngân hàng, ví điện tử..." onAdd={() => openCreate('NORMAL')} />
          : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {normalWallets.map(w => <WalletCard key={w.id} wallet={w} onEdit={() => openEdit(w)} />)}
            </div>
      )}

      {activeTab === 'DEBT' && !isLoading && (
        debtWallets.length === 0
          ? <EmptyState title="Chưa có khoản nợ nào" desc="Theo dõi thẻ tín dụng và khoản trả góp..." onAdd={() => openCreate('DEBT')} />
          : <div className="flex flex-col gap-3">
              {debtWallets.map(w => <WalletCard key={w.id} wallet={w} onEdit={() => openEdit(w)} />)}
            </div>
      )}

      <button onClick={() => openCreate(activeTab)}
        className="fixed bottom-20 right-4 z-40 md:hidden w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 active:scale-95 transition-all">
        <Plus size={24} />
      </button>

      <WalletFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} editingWallet={editing} defaultType={defaultType} />
    </div>
  )
}

const EmptyState = ({ title, desc, onAdd }: { title: string; desc: string; onAdd: () => void }) => (
  <div className={`${DS.card} text-center py-10`}>
    <p className={DS.heading3}>{title}</p>
    <p className={`${DS.muted} mt-2 mb-4`}>{desc}</p>
    <Button leftIcon={<Plus size={16} />} onClick={onAdd}>Tạo mới</Button>
  </div>
)

export default WalletsPage