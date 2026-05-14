import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import { DS } from '@/lib/design-system'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { useAuthStore } from '@/stores/authStore'
import { usePlan } from '@/hooks/usePlan'
import { api } from '@/lib/api'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { User, Lock, CreditCard, Bot } from 'lucide-react'
import { notify, TOAST_MESSAGES } from '@/lib/toast'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'profile' | 'password' | 'subscription' | 'ai'

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
    firstName: z.string().min(1, 'Tên không được để trống'),
    lastName: z.string().optional(),
})

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Nhập mật khẩu hiện tại'),
    newPassword: z.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu mới'),
}).refine(
    d => d.newPassword === d.confirmPassword,
    { message: 'Mật khẩu xác nhận không khớp', path: ['confirmPassword'] }
)

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

// ─── Component ────────────────────────────────────────────────────────────────

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>('profile')
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const setAuth = useAuthStore(s => s.setAuth)
    const user = useAuthStore(s => s.user)
    const { plan, isPremium, isFree } = usePlan()

    // ── Fetch profile ───────────────────────────────────────────────────────────
    const { data: profile } = useQuery({
        queryKey: ['user', 'profile'],
        queryFn: async () => (await api.get('/api/users/me')).data,
    })

    // ── Profile form ────────────────────────────────────────────────────────────
    const profileForm = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        values: {
            firstName: profile?.firstName ?? '',
            lastName: profile?.lastName ?? '',
        },
    })

    const updateProfileMutation = useMutation({
        mutationFn: (data: ProfileForm) => api.put('/api/users/me', data),
        onSuccess: (res) => {
            if (user) setAuth({ ...user, firstName: res.data.firstName }, localStorage.getItem('token')!)
            notify.success(TOAST_MESSAGES.auth.profileUpdated)
        },
        onError: () => notify.error('Cập nhật thất bại'),
    })

    // ── Password form ───────────────────────────────────────────────────────────
    const passwordForm = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
    })

    const changePasswordMutation = useMutation({
        mutationFn: (data: PasswordForm) => api.put('/api/users/me/password', {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        }),
        onSuccess: () => {
            passwordForm.reset()
            notify.success(TOAST_MESSAGES.auth.passwordChanged)
        },
        onError: (err: any) => {
            notify.error(err.response?.data?.message ?? 'Đổi mật khẩu thất bại')
        },
    })

    // ── Helpers ─────────────────────────────────────────────────────────────────
    const showSuccess = (msg: string) => {
        setSuccessMsg(msg)
        setErrorMsg(null)
        setTimeout(() => setSuccessMsg(null), 3000)
    }

    const showError = (msg: string) => {
        setErrorMsg(msg)
        setSuccessMsg(null)
    }

    // ── Tabs config ─────────────────────────────────────────────────────────────
    const TABS: { key: Tab; label: string; icon: typeof User }[] = [
        { key: 'profile', label: 'Hồ sơ', icon: User },
        { key: 'password', label: 'Mật khẩu', icon: Lock },
        { key: 'subscription', label: 'Gói dịch vụ', icon: CreditCard },
        { key: 'ai', label: 'AI', icon: Bot },
    ]

    return (
        <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">

            <div>
                <h1 className={DS.heading1}>Cài đặt</h1>
                <p className={DS.muted}>Quản lý tài khoản của bạn</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-surface-border">
                {TABS.map(tab => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setActiveTab(tab.key)
                                setSuccessMsg(null)
                                setErrorMsg(null)
                            }}
                            className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium
                border-b-2 transition-colors
                ${activeTab === tab.key
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-text-muted hover:text-text-primary'
                                }
              `}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Thông báo */}
            {successMsg && (
                <div className="bg-success-50 border border-success-500 rounded-lg px-4 py-3">
                    <p className="text-sm text-success-600">✓ {successMsg}</p>
                </div>
            )}
            {errorMsg && (
                <div className="bg-danger-50 border border-danger-500 rounded-lg px-4 py-3">
                    <p className="text-sm text-danger-600">{errorMsg}</p>
                </div>
            )}

            {/* ── Tab: Profile ─────────────────────────────────────────────────────── */}
            {activeTab === 'profile' && (
                <div className={DS.card}>
                    <h2 className={`${DS.heading2} mb-5`}>Thông tin cá nhân</h2>
                    <form
                        onSubmit={profileForm.handleSubmit(d => updateProfileMutation.mutate(d))}
                        className="flex flex-col gap-4"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Tên"
                                required
                                error={profileForm.formState.errors.firstName?.message}
                                {...profileForm.register('firstName')}
                            />
                            <Input
                                label="Họ"
                                error={profileForm.formState.errors.lastName?.message}
                                {...profileForm.register('lastName')}
                            />
                        </div>
                        <Input
                            label="Email"
                            value={profile?.email ?? ''}
                            disabled
                            helperText="Email không thể thay đổi"
                        />
                        <Button
                            type="submit"
                            loading={updateProfileMutation.isPending}
                            className="w-fit"
                        >
                            Lưu thay đổi
                        </Button>
                    </form>
                </div>
            )}

            {/* ── Tab: Password ────────────────────────────────────────────────────── */}
            {activeTab === 'password' && (
                <div className={DS.card}>
                    <h2 className={`${DS.heading2} mb-5`}>Đổi mật khẩu</h2>
                    <form
                        onSubmit={passwordForm.handleSubmit(d => changePasswordMutation.mutate(d))}
                        className="flex flex-col gap-4"
                        noValidate
                    >
                        <Input
                            label="Mật khẩu hiện tại"
                            type="password"
                            placeholder="••••••••"
                            error={passwordForm.formState.errors.currentPassword?.message}
                            {...passwordForm.register('currentPassword')}
                        />
                        <Input
                            label="Mật khẩu mới"
                            type="password"
                            placeholder="••••••••"
                            helperText="Ít nhất 8 ký tự"
                            error={passwordForm.formState.errors.newPassword?.message}
                            {...passwordForm.register('newPassword')}
                        />
                        <Input
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            placeholder="••••••••"
                            error={passwordForm.formState.errors.confirmPassword?.message}
                            {...passwordForm.register('confirmPassword')}
                        />
                        <Button
                            type="submit"
                            loading={changePasswordMutation.isPending}
                            className="w-fit"
                        >
                            Đổi mật khẩu
                        </Button>
                    </form>
                </div>
            )}

            {/* ── Tab: Subscription ────────────────────────────────────────────────── */}
            {activeTab === 'subscription' && (
                <div className="flex flex-col gap-4">
                    <div className={DS.card}>
                        <h2 className={`${DS.heading2} mb-4`}>Gói hiện tại</h2>

                        <div className="flex items-center justify-between py-3 border-b border-surface-border">
                            <span className={DS.label}>Gói</span>
                            <span className={`font-semibold ${isPremium ? 'text-amber-600' : 'text-text-primary'}`}>
                                {isPremium ? '💎 Premium' : isFree ? '🆓 Miễn phí' : '⭐ Plus'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-surface-border">
                            <span className={DS.label}>Trạng thái</span>
                            <span className="text-success-600 font-medium text-sm">● Đang hoạt động</span>
                        </div>

                        {profile?.expiresAt && (
                            <div className="flex items-center justify-between py-3 border-b border-surface-border">
                                <span className={DS.label}>Hết hạn</span>
                                <span className={DS.body}>{profile.expiresAt.split('T')[0]}</span>
                            </div>
                        )}

                        {!isPremium && (
                            <div className="mt-4">
                                <Button
                                    variant="premium"
                                    onClick={() => navigate('/pricing')}
                                >
                                    {isFree ? '⭐ Nâng cấp Plus miễn phí' : '💎 Nâng cấp Premium'}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Tính năng của gói hiện tại */}
                    <div className={DS.cardMuted}>
                        <p className={`${DS.label} mb-3`}>Tính năng gói {plan}</p>
                        <ul className="flex flex-col gap-2">
                            {(isFree
                                ? ['50 giao dịch/tháng', 'Thống kê cơ bản']
                                : isPremium
                                    ? ['Giao dịch không giới hạn', 'AI không giới hạn',
                                        'Theo dõi đồ dùng', 'Thông báo hết hạn']
                                    : ['Giao dịch không giới hạn', 'Danh mục chi tiêu',
                                        'Mục tiêu tài chính', 'AI 20 tin/tháng']
                            ).map(feature => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                                    <span className="text-success-500">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {/* ── Tab: AI ────────────────────────────────────────────────── */}
            {activeTab === 'ai' && (
                <div className="flex flex-col gap-4">
                    <div className={DS.card}>
                        <h2 className={`${DS.heading2} mb-2`}>Gemini AI Key</h2>
                        <p className={`${DS.muted} mb-4`}>
                            Plus user cần tự nhập Gemini API key để dùng tính năng AI.
                            Lấy key miễn phí tại{' '}
                            <a
                                href="https://aistudio.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:underline"
                            >
                                aistudio.google.com
                            </a>
                        </p>

                        {isFree ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                                <p className="text-sm text-amber-700">
                                    ⭐ Nâng cấp Plus để dùng tính năng AI.
                                    <button onClick={() => navigate('/pricing')}
                                        className="ml-1 underline font-medium">
                                        Nâng cấp ngay
                                    </button>
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Input
                                    label="Gemini API Key"
                                    type="password"
                                    placeholder="AIzaSy..."
                                    helperText="Key được lưu trên thiết bị của bạn, không gửi lên server"
                                    value={localStorage.getItem('gemini_api_key') ?? ''}
                                    onChange={e => {
                                        localStorage.setItem('gemini_api_key', e.target.value)
                                    }}
                                />
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => {
                                            localStorage.removeItem('gemini_api_key')
                                            notify.success('Đã xóa API key')
                                        }}
                                        variant="ghost"
                                    >
                                        Xóa key
                                    </Button>
                                    <a
                                        href="https://aistudio.google.com/app/apikey"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={DS.btnPrimary}
                                    >
                                        🔑 Lấy key miễn phí
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Hướng dẫn */}
                    <div className={DS.cardMuted}>
                        <p className={`${DS.label} mb-2`}>Cách lấy Gemini API Key</p>
                        <ol className="flex flex-col gap-1 text-sm text-text-secondary list-decimal list-inside">
                            <li>Vào <strong>aistudio.google.com</strong> (đăng nhập Google)</li>
                            <li>Click <strong>"Get API Key"</strong> → <strong>"Create API key"</strong></li>
                            <li>Copy key và paste vào ô trên</li>
                            <li>Miễn phí 15 requests/phút, 1500/ngày</li>
                        </ol>
                    </div>
                </div >
            )}

        </div >
    )
}


export default SettingsPage