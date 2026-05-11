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
import {
    GOAL_ICONS, GOAL_TYPE_CONFIG,
    type GoalResponse, type GoalType,
} from '@/types/goal'
import { CATEGORY_COLORS } from '@/types/category'
import { useCreateGoal, useUpdateGoal } from '@/hooks/useGoals'
import { getErrorMessage } from '@/utils/errorUtils'
import { parseSmartVNDInput, formatVND } from '@/utils/format'

const toPascalCase = (s: string) =>
    s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')

const goalSchema = z.object({
    name: z.string().min(1, 'Tên không được để trống').max(100),
    type: z.enum(['SAVINGS', 'DEBT', 'INVESTMENT']),
    targetAmount: z.string().min(1, 'Số tiền không được để trống')
        .refine(v => parseSmartVNDInput(v) > 0, 'Số tiền phải lớn hơn 0'),
    deadline: z.string().optional(),
})

type GoalFormData = z.infer<typeof goalSchema>

interface GoalFormModalProps {
    isOpen: boolean
    onClose: () => void
    editingGoal: GoalResponse | null
    defaultType?: GoalType
}

export const GoalFormModal = ({
    isOpen, onClose, editingGoal, defaultType = 'SAVINGS',
}: GoalFormModalProps) => {

    const isEditMode = editingGoal !== null
    const [selectedIcon, setSelectedIcon] = useState('target')
    const [selectedColor, setSelectedColor] = useState('#82b01e')
    const [serverError, setServerError] = useState<string | null>(null)

    const createMutation = useCreateGoal()
    const updateMutation = useUpdateGoal()

    const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } =
        useForm<GoalFormData>({ resolver: zodResolver(goalSchema) })

    const selectedType = watch('type') as GoalType ?? defaultType

    useEffect(() => {
        if (!isOpen) return
        reset({
            name: editingGoal?.name ?? '',
            type: editingGoal?.type ?? defaultType,
            targetAmount: editingGoal?.targetAmount ? editingGoal.targetAmount.toLocaleString('vi-VN') : '',
            deadline: editingGoal?.deadline ?? '',
        })
        setSelectedIcon(editingGoal?.icon ?? 'target')
        setSelectedColor(editingGoal?.color ?? GOAL_TYPE_CONFIG[editingGoal?.type ?? defaultType].color)
        setServerError(null)
    }, [isOpen, editingGoal, defaultType, reset])

    const onSubmit = async (data: GoalFormData) => {
        setServerError(null)
        const payload = {
            name: data.name.trim(),
            type: data.type,
            icon: selectedIcon,
            color: selectedColor,
            targetAmount: parseSmartVNDInput(data.targetAmount),
            deadline: data.deadline || null,
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
            <div className={`${DS.card} w-full sm:max-w-md rounded-t-2xl sm:rounded-xl max-h-[90vh] overflow-y-auto ${animations.slideInBottom} sm:${animations.scaleIn}`}>

                <div className="flex items-center justify-between mb-5">
                    <h2 className={DS.heading2}>{isEditMode ? 'Sửa mục tiêu' : 'Thêm mục tiêu'}</h2>
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

                    {/* Type selector */}
                    <div>
                        <label className={DS.label}>Loại mục tiêu</label>
                        <input type="hidden" {...register('type')} />
                        <div className="grid grid-cols-3 gap-2 mt-1">
                            {(['SAVINGS', 'DEBT', 'INVESTMENT'] as GoalType[]).map(type => {
                                const cfg = GOAL_TYPE_CONFIG[type]
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => {
                                            setValue('type', type, { shouldValidate: true })
                                            // Auto-set màu theo type nếu chưa custom
                                            setSelectedColor(cfg.color)
                                        }}
                                        className={`
                      flex flex-col items-center gap-1 p-2 rounded-xl border-2
                      text-xs font-semibold transition-all
                      ${selectedType === type
                                                ? `${cfg.borderClass} ${cfg.bgClass} ${cfg.textClass}`
                                                : 'border-surface-border text-text-muted hover:border-surface-border'
                                            }
                      ${type === 'DEBT' ? 'ring-0 hover:ring-2 hover:ring-danger-200' : ''}
                    `}
                                    >
                                        <span>{type === 'DEBT' ? '⚠' : type === 'SAVINGS' ? '🐷' : '📈'}</span>
                                        {cfg.label}
                                    </button>
                                )
                            })}
                        </div>
                        {/* DEBT warning hint */}
                        {selectedType === 'DEBT' && (
                            <p className="text-xs text-danger-600 mt-1.5 flex items-center gap-1">
                                ⚠ Nợ sẽ được hiển thị nổi bật để nhắc nhở ưu tiên trả.
                            </p>
                        )}
                    </div>

                    <Input
                        label="Tên mục tiêu"
                        placeholder={
                            selectedType === 'SAVINGS' ? 'Mua iPhone, Mua xe...' :
                                selectedType === 'DEBT' ? 'Trả nợ thẻ tín dụng...' :
                                    'Cổ phiếu VIC, Bitcoin...'
                        }
                        error={errors.name?.message}
                        {...register('name')}
                    />

                    {/* Target amount */}
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
                        {watch('targetAmount') && parseSmartVNDInput(watch('targetAmount')) > 0 && (
                            <p className="text-xs text-text-muted mt-1">
                                = {formatVND(parseSmartVNDInput(watch('targetAmount')))}
                            </p>
                        )}
                    </div>

                    <Input
                        label="Hạn chót (tùy chọn)"
                        type="date"
                        error={errors.deadline?.message}
                        {...register('deadline')}
                    />

                    {/* Icon picker */}
                    <div>
                        <label className={DS.label}>Icon</label>
                        <div className="grid grid-cols-8 gap-2 mt-2">
                            {GOAL_ICONS.map(iconName => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const IconComp = (Icons as any)[toPascalCase(iconName)] || Icons.Target
                                const isSel = iconName === selectedIcon
                                return (
                                    <button key={iconName} type="button" onClick={() => setSelectedIcon(iconName)}
                                        className="aspect-square rounded-lg flex items-center justify-center transition-all"
                                        style={isSel ? {
                                            backgroundColor: selectedColor,
                                            color: '#fff',
                                            outline: `2px solid ${selectedColor}`,
                                            outlineOffset: '2px',
                                        } : { backgroundColor: '#e5e7eb', color: '#374151' }}>
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
                        <Button type="submit"
                            loading={isSubmitting || createMutation.isPending || updateMutation.isPending}
                            className="flex-1">
                            {isEditMode ? 'Cập nhật' : 'Tạo mục tiêu'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}