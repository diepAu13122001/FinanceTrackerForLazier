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
import { GOAL_ICONS, GOAL_TYPE_CONFIG, type GoalResponse, type GoalType } from '@/types/goal'
import { CATEGORY_COLORS } from '@/types/category'
import { useCreateGoal, useUpdateGoal } from '@/hooks/useGoals'
import { getErrorMessage } from '@/utils/errorUtils'
import { parseSmartVNDInput, formatVND } from '@/utils/format'

const toPascalCase = (s: string) =>
    s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')

const walletSchema = z.object({
    name: z.string().min(1, 'Tên không được để trống').max(100),
    type: z.enum(['SAVINGS', 'DEBT', 'INVESTMENT', 'NORMAL']),
    subtype: z.enum(['CREDIT_CARD', 'INSTALLMENT']).optional(),
    targetAmount: z.string().optional(),
    deadline: z.string().optional(),
    creditLimit: z.string().optional(),
    billingDate: z.string().optional(),
    interestRate: z.string().optional(),
})

type WalletFormData = z.infer<typeof walletSchema>

interface GoalFormModalProps {
    isOpen: boolean
    onClose: () => void
    editingGoal: GoalResponse | null
    defaultType?: GoalType
}

export const GoalFormModal = ({
    isOpen, onClose, editingGoal, defaultType = 'NORMAL',
}: GoalFormModalProps) => {

    const isEditMode = editingGoal !== null
    const [selectedIcon, setSelectedIcon] = useState('wallet')
    const [selectedColor, setSelectedColor] = useState('#8b5cf6')
    const [serverError, setServerError] = useState<string | null>(null)

    const createMutation = useCreateGoal()
    const updateMutation = useUpdateGoal()

    const { register, handleSubmit, watch, setValue, reset,
        formState: { errors, isSubmitting } } =
        useForm<WalletFormData>({ resolver: zodResolver(walletSchema) })

    const selectedType = (watch('type') ?? defaultType) as GoalType
    const selectedSubtype = watch('subtype')

    useEffect(() => {
        if (!isOpen) return
        const type = editingGoal?.type ?? defaultType
        reset({
            name: editingGoal?.name ?? '',
            type,
            subtype: editingGoal?.subtype ?? undefined,
            targetAmount: editingGoal?.targetAmount
                ? editingGoal.targetAmount.toLocaleString('vi-VN') : '',
            deadline: editingGoal?.deadline ?? '',
            creditLimit: editingGoal?.creditLimit
                ? editingGoal.creditLimit.toLocaleString('vi-VN') : '',
            billingDate: editingGoal?.billingDate?.toString() ?? '',
            interestRate: editingGoal?.interestRate?.toString() ?? '',
        })
        setSelectedIcon(editingGoal?.icon ?? GOAL_TYPE_CONFIG[type].icon)
        setSelectedColor(editingGoal?.color ?? GOAL_TYPE_CONFIG[type].color)
        setServerError(null)
    }, [isOpen, editingGoal, defaultType, reset])

    const onSubmit = async (data: WalletFormData) => {
        setServerError(null)
        const payload = {
            name: data.name.trim(),
            type: data.type,
            subtype: data.subtype || null,
            icon: selectedIcon,
            color: selectedColor,
            targetAmount: data.targetAmount ? parseSmartVNDInput(data.targetAmount) : 0,
            deadline: data.deadline || null,
            creditLimit: data.creditLimit ? parseSmartVNDInput(data.creditLimit) : null,
            billingDate: data.billingDate ? parseInt(data.billingDate) : null,
            interestRate: data.interestRate ? parseFloat(data.interestRate) : null,
        }
        try {
            if (isEditMode && editingGoal) {
                await updateMutation.mutateAsync({ id: editingGoal.id, request: payload })
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
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className={`
                ${DS.card} w-full sm:max-w-md rounded-t-2xl sm:rounded-xl
                max-h-[90vh] overflow-y-auto
                ${animations.slideInBottom} sm:${animations.scaleIn}
            `}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className={DS.heading2}>
                        {isEditMode ? 'Sửa nguồn tiền' : 'Thêm nguồn tiền'}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-muted text-text-muted">
                        <X size={20} />
                    </button>
                </div>

                {serverError && (
                    <div className="bg-danger-50 border border-danger-500 rounded-lg px-4 py-3 mb-4">
                        <p className="text-sm text-danger-600">{serverError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>

                    {/* Type selector — 4 loại */}
                    <div>
                        <label className={DS.label}>Loại nguồn tiền</label>
                        <input type="hidden" {...register('type')} />
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {(['NORMAL', 'SAVINGS', 'DEBT', 'INVESTMENT'] as GoalType[]).map(type => {
                                const cfg = GOAL_TYPE_CONFIG[type]
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => {
                                            setValue('type', type, { shouldValidate: true })
                                            setSelectedColor(cfg.color)
                                            setSelectedIcon(cfg.icon)
                                            // Reset subtype khi đổi type
                                            if (type !== 'DEBT') setValue('subtype', undefined)
                                        }}
                                        className={`
                                            flex items-center gap-2 p-2.5 rounded-xl border-2
                                            text-sm font-semibold transition-all text-left
                                            ${selectedType === type
                                                ? `${cfg.borderClass} ${cfg.bgClass} ${cfg.textClass}`
                                                : 'border-surface-border text-text-muted'
                                            }
                                        `}
                                    >
                                        <span className="text-base">{cfg.emoji}</span>
                                        <div>
                                            <div className="font-bold text-xs">{cfg.label}</div>
                                            <div className="text-xs opacity-70 font-normal hidden sm:block">
                                                {cfg.description}
                                            </div>
                                        </div>
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
                                    { key: 'INSTALLMENT', label: '📅 Trả góp', desc: 'Trả hàng tháng' },
                                ] as { key: 'CREDIT_CARD' | 'INSTALLMENT'; label: string; desc: string }[]).map(st => (
                                    <button
                                        key={st.key}
                                        type="button"
                                        onClick={() => setValue('subtype', st.key)}
                                        className={`
                                            p-2.5 rounded-xl border-2 text-left text-sm
                                            transition-all font-medium
                                            ${selectedSubtype === st.key
                                                ? 'border-danger-300 bg-danger-50 text-danger-700'
                                                : 'border-surface-border text-text-muted'
                                            }
                                        `}
                                    >
                                        <div className="font-bold text-xs">{st.label}</div>
                                        <div className="text-xs opacity-70">{st.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <Input
                        label="Tên nguồn tiền"
                        placeholder={
                            selectedType === 'NORMAL' ? 'Tiền mặt, MB Bank, MoMo...' :
                                selectedType === 'SAVINGS' ? 'Mua iPhone, Mua xe...' :
                                    selectedType === 'DEBT' ? 'Thẻ tín dụng Vietcombank...' :
                                        'Cổ phiếu VIC, Bitcoin...'
                        }
                        error={errors.name?.message}
                        {...register('name')}
                    />

                    {/* SAVINGS / INVESTMENT: target amount */}
                    {(selectedType === 'SAVINGS' || selectedType === 'INVESTMENT') && (
                        <div>
                            <Input
                                label="Số tiền mục tiêu (VND)"
                                type="text"
                                placeholder="20.000.000"
                                error={errors.targetAmount?.message}
                                {...register('targetAmount')}
                                onBlur={e => {
                                    const p = parseSmartVNDInput(e.target.value)
                                    if (p > 0) setValue('targetAmount', p.toLocaleString('vi-VN'))
                                }}
                            />
                            {watch('targetAmount') && parseSmartVNDInput(watch('targetAmount') ?? '') > 0 && (
                                <p className="text-xs text-text-muted mt-1">
                                    = {formatVND(parseSmartVNDInput(watch('targetAmount') ?? ''))}
                                </p>
                            )}
                        </div>
                    )}

                    {/* DEBT CREDIT_CARD fields */}
                    {selectedType === 'DEBT' && selectedSubtype === 'CREDIT_CARD' && (
                        <>
                            <div>
                                <Input
                                    label="Hạn mức thẻ (VND)"
                                    type="text"
                                    placeholder="50.000.000"
                                    {...register('creditLimit')}
                                    onBlur={e => {
                                        const p = parseSmartVNDInput(e.target.value)
                                        if (p > 0) setValue('creditLimit', p.toLocaleString('vi-VN'))
                                    }}
                                />
                                {watch('creditLimit') && parseSmartVNDInput(watch('creditLimit') ?? '') > 0 && (
                                    <p className="text-xs text-text-muted mt-1">
                                        = {formatVND(parseSmartVNDInput(watch('creditLimit') ?? ''))}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Ngày đáo hạn hàng tháng"
                                    type="number"
                                    placeholder="15"
                                    min="1" max="28"
                                    helperText="Ngày (1-28) trả tiền mỗi tháng"
                                    {...register('billingDate')}
                                />
                                <Input
                                    label="Lãi suất (%/tháng)"
                                    type="number"
                                    placeholder="2.5"
                                    step="0.01"
                                    helperText="Lãi nếu không trả đúng hạn"
                                    {...register('interestRate')}
                                />
                            </div>
                        </>
                    )}

                    {/* DEBT INSTALLMENT fields */}
                    {selectedType === 'DEBT' && selectedSubtype === 'INSTALLMENT' && (
                        <>
                            <div>
                                <Input
                                    label="Tổng số tiền cần trả (VND)"
                                    type="text"
                                    placeholder="120.000.000"
                                    {...register('targetAmount')}
                                    onBlur={e => {
                                        const p = parseSmartVNDInput(e.target.value)
                                        if (p > 0) setValue('targetAmount', p.toLocaleString('vi-VN'))
                                    }}
                                />
                            </div>
                            <Input
                                label="Ngày trả hàng tháng"
                                type="number"
                                placeholder="15"
                                min="1" max="28"
                                {...register('billingDate')}
                            />
                        </>
                    )}

                    {/* Deadline (SAVINGS, DEBT) */}
                    {(selectedType === 'SAVINGS' || selectedType === 'DEBT') && (
                        <Input
                            label={selectedType === 'DEBT' ? 'Ngày tất toán (tùy chọn)' : 'Hạn chót (tùy chọn)'}
                            type="date"
                            {...register('deadline')}
                        />
                    )}

                    {/* Icon picker */}
                    <div>
                        <label className={DS.label}>Icon</label>
                        <div className="grid grid-cols-8 gap-2 mt-2">
                            {GOAL_ICONS.map(iconName => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const IconComp = (Icons as any)[toPascalCase(iconName)] || Icons.Wallet
                                const isSel = iconName === selectedIcon
                                return (
                                    <button key={iconName} type="button"
                                        onClick={() => setSelectedIcon(iconName)}
                                        className="aspect-square rounded-lg flex items-center justify-center transition-all"
                                        style={isSel ? {
                                            backgroundColor: selectedColor + '25',  // 🔄 SỬA: nhạt hơn để icon thấy rõ
                                            color: 'black',                    // 🔄 SỬA: dùng màu thay vì white
                                            outline: `2px solid ${selectedColor}`,
                                            outlineOffset: '2px',
                                        } : {
                                            backgroundColor: '#e5e7eb',
                                            color: '#374151',
                                        }}>
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
                                <button key={color} type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={`aspect-square rounded-full transition-transform ${color === selectedColor
                                        ? 'ring-2 ring-offset-2 ring-text-primary scale-110'
                                        : 'hover:scale-110'
                                        }`}
                                    style={{ backgroundColor: color }} />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Hủy</Button>
                        <Button type="submit"
                            loading={isSubmitting || createMutation.isPending || updateMutation.isPending}
                            className="flex-1">
                            {isEditMode ? 'Cập nhật' : 'Thêm nguồn tiền'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}