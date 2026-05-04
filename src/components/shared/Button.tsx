import { animations } from '@/lib/animations'
import { DS } from '@/lib/design-system'

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'premium'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    children: React.ReactNode
}

const sizeMap: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2   text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
}

const variantMap: Record<ButtonVariant, string> = {
    primary: DS.btnPrimary,
    ghost: DS.btnGhost,
    danger: DS.btnDanger,
    premium: DS.btnPremium,
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    className = '',
    ...props
}: ButtonProps) => {

    const isDisabled = disabled || loading

    return (
        <button
            className={`${variantMap[variant]} ${sizeMap[size]} ${className}`}
            disabled={isDisabled}
            aria-busy={loading}
            {...props}
        >
            {loading ? (
                <span className={`${animations.fadeIn} flex items-center gap-2`}>
                    <svg
                        className="animate-spin h-4 w-4 shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    <span className="opacity-75">{children}</span>
                </span>
            ) : (
                <>
                    {leftIcon && (
                        <span className="shrink-0" aria-hidden="true">
                            {leftIcon}
                        </span>
                    )}
                    <span>{children}</span>
                    {rightIcon && (
                        <span className="shrink-0" aria-hidden="true">
                            {rightIcon}
                        </span>
                    )}
                </>
            )}
        </button>
    )
}