import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { DS } from '@/lib/design-system'
import { transactionService, type TransactionType } from '@/services/transactionService'
import { formatVND, parseVNDInput } from '@/utils/format'
import { usePlan } from '@/hooks/usePlan'

// ─── Validation Schema ────────────────────────────────────────────────────────

const transactionSchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE']),

    amount: z
        .string()
        .min(1, 'Số tiền không được để trống')
        .refine(
            val => parseVNDInput(val) > 0,
            'Số tiền phải lớn hơn 0'
        ),

    note: z.string().optional(),

    transactionDate: z
        .string()
        .min(1, 'Ngày không được để trống'),
})

type TransactionFormData = z.infer<typeof transactionSchema>

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddTransactionModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void   // callback để refresh danh sách sau khi thêm
    // Dùng khi edit — truyền vào để pre-fill form
    editData?: {
        id: string
        type: TransactionType
        amount: number
        note: string | null
        transactionDate: string
    } | null
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AddTransactionModal = ({
    isOpen,
    onClose,
    onSuccess,
    editData = null,
}: AddTransactionModalProps) => {
    const { plan, isFree } = usePlan()
    const [serverError, setServerError] = useState<string | null>(null)

    const isEditMode = editData !== null

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: editData?.type ?? 'EXPENSE',
            amount: editData?.amount?.toString() ?? '',
            note: editData?.note ?? '',
            transactionDate: editData?.transactionDate ?? new Date().toISOString().split('T')[0],
        },
    })

    const selectedType = watch('type')

    // ── Submit ──────────────────────────────────────────────────────────────────
    const onSubmit = async (data: TransactionFormData) => {
        setServerError(null)
        try {
            const payload = {
                type: data.type as TransactionType,
                amount: parseVNDInput(data.amount),
                note: data.note || undefined,
                transactionDate: data.transactionDate,
            }

            if (isEditMode && editData) {
                await transactionService.update(editData.id, payload)
            } else {
                await transactionService.create(payload)
            }

            reset()
            onSuccess()
            onClose()
        } catch (error: any) {
            const errorCode = error.response?.data?.error
            const message = error.response?.data?.message

            // Lỗi giới hạn plan — interceptor chưa redirect vì cần hiện message trước
            if (errorCode === 'PLAN_UPGRADE_REQUIRED') {
                setServerError('Bạn đã đạt giới hạn 50 giao dịch/tháng. Nâng cấp Plus để tiếp tục.')
            } else {
                setServerError(message ?? 'Có lỗi xảy ra, vui lòng thử lại')
            }
        }
    }

    if (!isOpen) return null

    return (
        // Backdrop
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            {/* Modal */}
            <div className={`${DS.card} w-full max-w-md relative`}>

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className={DS.heading2}>
                        {isEditMode ? 'Sửa giao dịch' : 'Thêm giao dịch'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-surface-muted text-text-muted"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Cảnh báo giới hạn Free plan */}
                {isFree && (
                    <TransactionLimitWarning planId={plan} />
                )}

                {/* Server error */}
                {serverError && (
                    <div className="bg-danger-50 border border-danger-500 rounded-lg px-4 py-3 mb-4">
                        <p className="text-sm text-danger-600">{serverError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>

                    {/* Toggle INCOME / EXPENSE */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-surface-muted rounded-lg">
                        {(['EXPENSE', 'INCOME'] as const).map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setValue('type', type)}
                                className={`
                  py-2 rounded-md text-sm font-medium transition-all
                  ${selectedType === type
                                        ? type === 'INCOME'
                                            ? 'bg-success-500 text-white shadow-sm'
                                            : 'bg-danger-500 text-white shadow-sm'
                                        : 'text-text-secondary hover:text-text-primary'
                                    }
                `}
                            >
                                {type === 'INCOME' ? '↑ Thu nhập' : '↓ Chi tiêu'}
                            </button>
                        ))}
                    </div>

                    {/* Số tiền */}
                    <div>
                        <Input
                            label="Số tiền (VND)"
                            type="text"
                            placeholder="45.000"
                            error={errors.amount?.message}
                            {...register('amount')}
                            // Format khi blur — người dùng gõ "45000" → hiện "45.000"
                            onBlur={(e) => {
                                const parsed = parseVNDInput(e.target.value)
                                if (parsed > 0) {
                                    setValue('amount', parsed.toLocaleString('vi-VN'))
                                }
                            }}
                        />
                        {/* Preview số tiền đã format */}
                        {watch('amount') && parseVNDInput(watch('amount')) > 0 && (
                            <p className="text-xs text-text-muted mt-1">
                                = {formatVND(parseVNDInput(watch('amount')))}
                            </p>
                        )}
                    </div>

                    <Input
                        label="Ghi chú"
                        placeholder="Cà phê Highlands, Tiền điện tháng 1..."
                        error={errors.note?.message}
                        {...register('note')}
                    />

                    <Input
                        label="Ngày"
                        type="date"
                        error={errors.transactionDate?.message}
                        {...register('transactionDate')}
                    />

                    {/* Buttons */}
                    <div className="flex gap-3 mt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant={selectedType === 'INCOME' ? 'primary' : 'danger'}
                            loading={isSubmitting}
                            className="flex-1"
                        >
                            {isEditMode ? 'Cập nhật' : selectedType === 'INCOME' ? 'Thêm thu nhập' : 'Thêm chi tiêu'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}

// ─── Sub-component: Cảnh báo giới hạn Free ───────────────────────────────────

const TransactionLimitWarning = ({ planId }: { planId: string }) => {
    // Component này sẽ fetch summary ở Ngày 17 — tạm thời hardcode
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-xs text-amber-700">
                ⚠ Gói <strong>Miễn phí</strong> giới hạn 50 giao dịch/tháng.{' '}
                <a href="/pricing" className="underline font-medium">Nâng cấp Plus</a>
                {' '}để không giới hạn.
            </p>
        </div>
    )
}