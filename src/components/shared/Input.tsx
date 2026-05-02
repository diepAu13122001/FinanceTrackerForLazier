import { DS } from '@/lib/design-system'

// ─── Types ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Input = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    id,
    className = '',
    ...props
}: InputProps) => {

    // Tự tạo id nếu không được cung cấp (để kết nối label với input)
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`

    return (
        <div className="flex flex-col gap-1.5">

            {/* Label */}
            {label && (
                <label htmlFor={inputId} className={DS.label}>
                    {label}
                    {props.required && (
                        <span className="text-danger-500 ml-0.5" aria-hidden="true">*</span>
                    )}
                </label>
            )}

            {/* Input wrapper — cần relative để định vị icon */}
            <div className="relative">

                {/* Icon bên trái */}
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                        {leftIcon}
                    </div>
                )}

                <input
                    id={inputId}
                    className={[
                        DS.inputBase,
                        leftIcon ? 'pl-9' : '',   // thêm padding nếu có icon
                        rightIcon ? 'pr-9' : '',
                        error ? 'border-danger-500 focus:ring-danger-500' : '',
                        className,
                    ].join(' ')}
                    aria-invalid={!!error}
                    aria-describedby={
                        error ? `${inputId}-error` :
                            helperText ? `${inputId}-helper` :
                                undefined
                    }
                    {...props}
                />

                {/* Icon bên phải */}
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                        {rightIcon}
                    </div>
                )}
            </div>

            {/* Thông báo lỗi */}
            {error && (
                <p
                    id={`${inputId}-error`}
                    className="text-xs text-danger-500 flex items-center gap-1"
                    role="alert"
                >
                    <span aria-hidden="true">⚠</span>
                    {error}
                </p>
            )}

            {/* Helper text — chỉ hiện khi không có lỗi */}
            {helperText && !error && (
                <p id={`${inputId}-helper`} className={DS.muted}>
                    {helperText}
                </p>
            )}

        </div>
    )
}