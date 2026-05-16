import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import * as Icons from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { DS } from '@/lib/design-system'
import { animations } from '@/lib/animations'
import { WALLET_ICONS, WALLET_TYPE_CONFIG, type WalletResponse, type WalletType } from '@/types/wallet'
import { CATEGORY_COLORS } from '@/types/category'
import { useCreateWallet, useUpdateWallet } from '@/hooks/useWallets'
import { getErrorMessage } from '@/utils/errorUtils'
import { parseSmartVNDInput, formatVND } from '@/utils/format'

const toPascalCase = (s: string) =>
    s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')

const walletSchema = z.object({
    name: z.string().min(1, 'Tên không được để trống').max(100),
    type: z.enum(['NORMAL', 'DEBT']),
    subtype: z.enum(['CREDIT_CARD', 'INSTALLMENT']).optional(),
    creditLimit: z.string().optional(),
    billingDate: z.string().optional(),
    numberOfPeriods: z.string().optional(),
    monthlyPayment: z.string().optional(),
    initialAmount: z.string().optional(),
})

type WalletFormData = z.infer<typeof walletSchema>

interface WalletFormModalProps {
    isOpen: boolean
    onClose: () => void
    editingWallet: WalletResponse | null
    defaultType?: WalletType
}

export const WalletFormModal = ({ isOpen, onClose, editingWallet, defaultType = 'NORMAL' }: WalletFormModalProps) => {
    const isEditMode = editingWallet !== null
    const [selectedIcon, setSelectedIcon] = useState('wallet')
    const [selectedColor, setSelectedColor] = useState('#8b5cf6')
    const [serverError, setServerError] = useState<string | null>(null)

    const createMutation = useCreateWallet()
    const updateMutation = useUpdateWallet()

    const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } =
        useForm<WalletFormData>({ resolver: zodResolver(walletSchema) })

    const selectedType = (watch('type') ?? defaultType) as WalletType
    const selectedSubtype = watch('subtype')

    useEffect(() => {
        if (!isOpen) return
        const type = editingWallet?.type ?? defaultType
        reset({
            name: editingWallet?.name ?? '',
            type,
            subtype: editingWallet?.subtype ?? undefined,
            creditLimit: editingWallet?.creditLimit ? editingWallet.creditLimit.toLocaleString('vi-VN') : '',
            billingDate: editingWallet?.billingDate?.toString() ?? '',
            numberOfPeriods: editingWallet?.numberOfPeriods?.toString() ?? '',
            monthlyPayment: editingWallet?.monthlyPayment ? editingWallet.monthlyPayment.toLocaleString('vi-VN') : '',
            initialAmount: editingWallet?.initialAmount ? editingWallet.initialAmount.toLocaleString('vi-VN') : '',
        })
        setSelectedIcon(editingWallet?.icon ?? WALLET_TYPE_CONFIG[type].icon)
        setSelectedColor(editingWallet?.color ?? WALLET_TYPE_CONFIG[type].color)
        setServerError(null)
    }, [isOpen, editingWallet, defaultType, reset])

    const onSubmit = async (data: WalletFormData) => {
        setServerError(null)
        const payload = {
            name: data.name.trim(),
            type: data.type,
            subtype: data.subtype || null,
            icon: selectedIcon,
            color: selectedColor,
            creditLimit: data.creditLimit ? parseSmartVNDInput(data.creditLimit) : null,
            billingDate: data.billingDate ? parseInt(data.billingDate) : null,
            numberOfPeriods: data.numberOfPeriods ? parseInt(data.numberOfPeriods) : null,
            monthlyPayment: data.monthlyPayment ? parseSmartVNDInput(data.monthlyPayment) : null,
            initialAmount: data.initialAmount ? parseSmartVNDInput(data.initialAmount) : null,
        }
        try {
            if (isEditMode && editingWallet) {
                await updateMutation.mutateAsync({ id: editingWallet.id, request: payload })
            } else {
                await createMutation.mutateAsync(payload)
            }
            onClose()
        } catch (err: unknown) {
            setServerError(getErrorMessage(err, 'Có lỗi xảy ra'))
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className={`${DS.card} w-full sm:max-w-md rounded-t-2xl sm:rounded-xl max-h-[90vh] overflow-y-auto ${animations.slideInBottom}`}>

                <div className="flex items-center justify-between mb-5">
                    <h2 className={DS.heading2}>{isEditMode ? 'Sửa nguồn tiền' : 'Thêm nguồn tiền'}</h2>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-muted text-text-muted"><X size={20} /></button>
                </div>

                {serverError && (
                    <div className="bg-danger-50 border border-danger-500 rounded-lg px-4 py-3 mb-4">
                        <p className="text-sm text-danger-600">{serverError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>

                    {/* Type selector */}
                    <div>
                        <label className={DS.label}>Loại nguồn tiền</label>
                        <input type="hidden" {...register('type')} />
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {(['NORMAL', 'DEBT'] as WalletType[]).map(type => {
                                const c = WALLET_TYPE_CONFIG[type]
                                const isActive = selectedType === type
                                return (
                                    <button key={type} type="button"
                                        onClick={() => { setValue('type', type, { shouldValidate: true }); setSelectedColor(c.color); setSelectedIcon(c.icon); if (type !== 'DEBT') setValue('subtype', undefined) }}
                                        className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-sm font-semibold transition-all text-left ${isActive ? `${c.borderClass} ${c.bgClass}` : 'border-surface-border'}`}
                                        style={isActive ? { color: c.color } : { color: '#6b7280' }}>
                                        <span className="text-base">{c.emoji}</span>
                                        <span className="font-bold text-xs">{c.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* DEBT subtype */}
                    {selectedType === 'DEBT' && (
                        <div>
                            <label className={DS.label}>Loại nợ</label>
                            <input type="hidden" {...register('subtype')} />
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                {([
                                    { key: 'CREDIT_CARD', label: '💳 Thẻ tín dụng', desc: 'Hạn mức + ngày đáo hạn' },
                                    { key: 'INSTALLMENT', label: '📅 Trả góp', desc: 'Số kỳ + tiền mỗi kỳ' },
                                ] as { key: 'CREDIT_CARD' | 'INSTALLMENT'; label: string; desc: string }[]).map(st => (
                                    <button key={st.key} type="button"
                                        onClick={() => setValue('subtype', st.key)}
                                        className={`p-2.5 rounded-xl border-2 text-left text-sm transition-all font-medium ${selectedSubtype === st.key ? 'border-danger-300 bg-danger-50' : 'border-surface-border'}`}
                                        style={selectedSubtype === st.key ? { color: '#ef4444' } : { color: '#6b7280' }}>
                                        <div className="font-bold text-xs">{st.label}</div>
                                        <div className="text-xs opacity-70">{st.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <Input label="Tên nguồn tiền"
                        placeholder={selectedType === 'NORMAL' ? 'Tiền mặt, MB Bank, MoMo...' : 'Thẻ Vietcombank, Khoản vay...'}
                        error={errors.name?.message} {...register('name')} />

                    {selectedType === 'DEBT' && selectedSubtype === 'CREDIT_CARD' && (
                        <>
                            <div>
                                <Input label="Hạn mức thẻ (VND)" type="text" placeholder="50.000.000"
                                    {...register('creditLimit')}
                                    onBlur={e => { const p = parseSmartVNDInput(e.target.value); if (p > 0) setValue('creditLimit', p.toLocaleString('vi-VN')) }} />
                                {watch('creditLimit') && parseSmartVNDInput(watch('creditLimit') ?? '') > 0 && (
                                    <p className="text-xs text-text-muted mt-1">= {formatVND(parseSmartVNDInput(watch('creditLimit') ?? ''))}</p>
                                )}
                            </div>
                            <Input label="Ngày đáo hạn hàng tháng" type="number" placeholder="15"
                                helperText="Ngày trong tháng phải thanh toán" min="1" max="28" {...register('billingDate')} />
                        </>
                    )}

                    {selectedType === 'DEBT' && selectedSubtype === 'INSTALLMENT' && (
                        <>
                            <div>
                                <Input label="Số tiền vay ban đầu (VND)" type="text" placeholder="120.000.000"
                                    {...register('initialAmount')}
                                    onBlur={e => { const p = parseSmartVNDInput(e.target.value); if (p > 0) setValue('initialAmount', p.toLocaleString('vi-VN')) }} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Input label="Số kỳ (tháng)" type="number" placeholder="12" {...register('numberOfPeriods')} />
                                <Input label="Tiền mỗi kỳ (VND)" type="text" placeholder="5.000.000"
                                    helperText="Đã gồm lãi suất" {...register('monthlyPayment')}
                                    onBlur={e => { const p = parseSmartVNDInput(e.target.value); if (p > 0) setValue('monthlyPayment', p.toLocaleString('vi-VN')) }} />
                            </div>
                            {watch('numberOfPeriods') && watch('monthlyPayment') && (
                                <div className="bg-surface-muted rounded-lg px-3 py-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Tổng phải trả:</span>
                                        <span className="font-bold">
                                            {formatVND(parseInt(watch('numberOfPeriods') ?? '0') * parseSmartVNDInput(watch('monthlyPayment') ?? ''))}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Icon picker */}
                    <div>
                        <label className={DS.label}>Icon</label>
                        <div className="grid grid-cols-8 gap-2 mt-2">
                            {WALLET_ICONS.map(iconName => {
                                const IconComp = (Icons as any)[toPascalCase(iconName)] || Icons.Wallet
                                const isSel = iconName === selectedIcon
                                return (
                                    <button key={iconName} type="button" onClick={() => setSelectedIcon(iconName)}
                                        className="aspect-square rounded-lg flex items-center justify-center transition-all"
                                        style={isSel ? { backgroundColor: selectedColor + '20', color: selectedColor, outline: `2px solid ${selectedColor}`, outlineOffset: '2px' }
                                            : { backgroundColor: '#e5e7eb', color: '#374151' }}>
                                        <IconComp size={17} />
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Color picker */}
                    <div>
                        <label className={DS.label}>Màu sắc</label>
                        <div className="grid grid-cols-10 gap-2 mt-2">
                            {CATEGORY_COLORS.map(color => (
                                <button key={color} type="button" onClick={() => setSelectedColor(color)}
                                    className={`aspect-square rounded-full transition-transform ${color === selectedColor ? 'ring-2 ring-offset-2 ring-text-primary scale-110' : 'hover:scale-110'}`}
                                    style={{ backgroundColor: color }} />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Hủy</Button>
                        <Button type="submit" loading={isSubmitting || createMutation.isPending || updateMutation.isPending} className="flex-1">
                            {isEditMode ? 'Cập nhật' : 'Thêm nguồn tiền'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}