import { DS } from '@/lib/design-system'

// ─── Base Skeleton ────────────────────────────────────────────────────────────

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

export const Skeleton = ({ className = '' }: SkeletonProps) => (
    <div className={`bg-surface-border rounded animate-pulse ${className}`} />
)

// ─── Skeleton cho transaction item ───────────────────────────────────────────

export const TransactionItemSkeleton = () => (
    <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-1.5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-4 w-20 shrink-0" />
    </div>
)

// ─── Skeleton cho summary card ────────────────────────────────────────────────

export const SummaryCardSkeleton = () => (
    <div className={DS.card}>
        <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
        <Skeleton className="h-7 w-32" />
    </div>
)

// ─── Skeleton cho chart ───────────────────────────────────────────────────────

export const ChartSkeleton = () => (
    <div className={DS.card}>
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="flex items-end gap-2 h-48 px-2">
            {/* Bars giả để trông giống chart thật */}
            {[60, 40, 75, 55, 85, 45, 70, 50, 90, 35, 65, 80].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                    <Skeleton className="w-full rounded-t" style={{ height: `${h}%` }} />
                </div>
            ))}
        </div>
        <div className="flex justify-between mt-3 px-2">
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-6" />
            ))}
        </div>
    </div>
)

// ─── Skeleton cho settings page ───────────────────────────────────────────────

export const ProfileSkeleton = () => (
    <div className={`${DS.card} flex flex-col gap-4`}>
        <Skeleton className="h-6 w-32 mb-1" />
        <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
        </div>
        <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" />
    </div>
)