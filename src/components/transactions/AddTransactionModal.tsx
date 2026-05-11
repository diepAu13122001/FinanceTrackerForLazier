import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { DS } from '@/lib/design-system'
import { type TransactionType } from '@/services/transactionService'
import { formatVND, parseSmartVNDInput } from '@/utils/format'
import { usePlan } from '@/hooks/usePlan'
import { useCreateTransaction, useUpdateTransaction } from '@/hooks/useTransactions'
import { getErrorMessage, getErrorCode } from '@/utils/errorUtils'
import { animations } from '@/lib/animations'
import { CategorySelector } from '@/components/categories/CategorySelector'
import { PlanGate } from '@/components/shared/PlanGate'
import { GoalSelector } from '@/components/goals/GoalSelector'

const transactionSchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE']),

    amount: z
        .string()
        .min(1, 'Số tiền không được để trống')
        .refine(
            val => parseSmartVNDInput(val) > 0,
            'Số tiền phải lớn hơn 0'
        ),

    note: z.string().optional(),

    transactionDate: z
        .string()
        .min(1, 'Ngày không được để trống'),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface AddTransactionModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    editData?: {
        id: string
        type: TransactionType
        amount: number
        note: string | null
        transactionDate: string
        categoryId?: string | null
        goalId?: string | null
    } | null
    defaultType?: TransactionType
    defaultCategoryId?: string | null
    defaultGoalId?: string | null
}

export const AddTransactionModal = ({
    isOpen,
    onClose,
    onSuccess,
    editData = null,
    defaultType = 'EXPENSE',
    defaultCategoryId = null,
    defaultGoalId = null,
}: AddTransactionModalProps) => {

    const { plan, isFree } = usePlan()

    const [serverError, setServerError] = useState<string | null>(null)
    const [categoryId, setCategoryId] = useState<string | null>(null)
    const [goalId, setGoalId] = useState<string | null>(null)

    const isEditMode = editData !== null

    const createMutation = useCreateTransaction()
    const updateMutation = useUpdateTransaction()

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
            type: editData?.type ?? defaultType,
            amount: editData?.amount?.toString() ?? '',
            note: editData?.note ?? '',
            transactionDate:
                editData?.transactionDate ??
                new Date().toISOString().split('T')[0],
        },
    })

    const selectedType = watch('type')

    // FIX: reset form + sync type đúng mỗi lần mở modal
    useEffect(() => {
        if (!isOpen) return

        const initialType = editData?.type ?? defaultType

        reset({
            type: initialType,
            amount: editData?.amount
                ? editData.amount.toLocaleString('vi-VN')
                : '',
            note: editData?.note ?? '',
            transactionDate:
                editData?.transactionDate ??
                new Date().toISOString().split('T')[0],
        })

        // IMPORTANT FIX
        setValue('type', initialType)

        setCategoryId(editData?.categoryId ?? defaultCategoryId ?? null)
        setGoalId(editData?.goalId ?? defaultGoalId ?? null)

        setServerError(null)

    }, [isOpen, editData, defaultType, defaultCategoryId, reset, setValue])

    // Reset category khi đổi type (chỉ áp dụng create mode)
    useEffect(() => {
        if (!isEditMode) {
            setCategoryId(null)
        }
    }, [selectedType, isEditMode])

    const onSubmit = async (data: TransactionFormData) => {
        setServerError(null)

        const payload = {
            type: data.type as TransactionType,
            amount: parseSmartVNDInput(data.amount),
            note: data.note || undefined,
            transactionDate: data.transactionDate,
            categoryId: categoryId || undefined,
            goalId: goalId || undefined,
        }

        try {
            if (isEditMode && editData) {
                await updateMutation.mutateAsync({
                    id: editData.id,
                    payload,
                })
            } else {
                await createMutation.mutateAsync(payload)
            }

            reset()
            setCategoryId(null)

            onSuccess()
            onClose()

        } catch (error: unknown) {
            const code = getErrorCode(error)

            const message = getErrorMessage(
                error,
                'Có lỗi xảy ra, vui lòng thử lại'
            )

            if (code === 'PLAN_UPGRADE_REQUIRED') {
                setServerError(
                    'Bạn đã đạt giới hạn 50 giao dịch/tháng.'
                )
            } else {
                setServerError(message)
            }
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className={`
                ${DS.card} w-full sm:max-w-md
                rounded-t-2xl sm:rounded-xl
                max-h-[90vh] overflow-y-auto
                ${animations.slideInBottom} sm:${animations.scaleIn}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className={DS.heading2}>
                        {isEditMode
                            ? 'Sửa giao dịch'
                            : 'Thêm giao dịch'}
                    </h2>

                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-surface-muted text-text-muted"
                    >
                        <X size={20} />
                    </button>
                </div>

                {isFree && (
                    <TransactionLimitWarning planId={plan} />
                )}

                {serverError && (
                    <div className="bg-danger-50 border border-danger-500 rounded-lg px-4 py-3 mb-4">
                        <p className="text-sm text-danger-600">
                            {serverError}
                        </p>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                    noValidate
                >

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
                                {type === 'INCOME'
                                    ? '↑ Thu nhập'
                                    : '↓ Chi tiêu'}
                            </button>
                        ))}
                    </div>

                    {/* Amount */}
                    <div>
                        <Input
                            label="Số tiền (VND)"
                            type="text"
                            placeholder="45.000"
                            error={errors.amount?.message}
                            {...register('amount')}
                            onBlur={(e) => {
                                const parsed = parseSmartVNDInput(
                                    e.target.value
                                )

                                if (parsed > 0) {
                                    setValue(
                                        'amount',
                                        parsed.toLocaleString('vi-VN')
                                    )
                                }
                            }}
                        />

                        {watch('amount') &&
                            parseSmartVNDInput(watch('amount')) > 0 && (
                                <p className="text-xs text-text-muted mt-1">
                                    = {formatVND(
                                        parseSmartVNDInput(watch('amount'))
                                    )}
                                </p>
                            )}
                    </div>

                    {/* Note */}
                    <Input
                        label="Ghi chú"
                        placeholder="Cà phê Highlands..."
                        error={errors.note?.message}
                        {...register('note')}
                    />

                    {/* Category */}
                    <PlanGate requires="PLUS" fallback={null}>
                        <CategorySelector
                            value={categoryId}
                            onChange={setCategoryId}
                            type={selectedType}
                        />
                    </PlanGate>

                    {/* Goal */}
                    <PlanGate requires="PLUS" fallback={null}>
                        <GoalSelector
                            value={goalId}
                            onChange={setGoalId}
                        />
                    </PlanGate>

                    {/* Date */}
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
                            variant={
                                selectedType === 'INCOME'
                                    ? 'primary'
                                    : 'danger'
                            }
                            loading={isSubmitting}
                            className="flex-1"
                        >
                            {isEditMode
                                ? 'Cập nhật'
                                : selectedType === 'INCOME'
                                    ? 'Thêm thu nhập'
                                    : 'Thêm chi tiêu'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}

const TransactionLimitWarning = ({
    planId,
}: {
    planId: string
}) => {
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-xs text-amber-700">
                ⚠ Gói <strong>Miễn phí</strong>
                {' '}giới hạn 50 giao dịch/tháng.{` `}
                <a
                    href="/pricing"
                    className="underline font-medium"
                >
                    Nâng cấp Plus
                </a>
                {' '}để không giới hạn.
            </p>
        </div>
    )
}