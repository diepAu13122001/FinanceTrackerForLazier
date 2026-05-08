import * as Icons from 'lucide-react'
import type { CategoryResponse } from '@/types/category'

// Helper: convert kebab-case 'shopping-bag' → PascalCase 'ShoppingBag'
const toPascalCase = (str: string): string =>
    str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')

interface CategoryBadgeProps {
    category: CategoryResponse | null
    size?: 'sm' | 'md'
    showName?: boolean
}

export const CategoryBadge = ({
    category,
    size = 'md',
    showName = true,
}: CategoryBadgeProps) => {
    if (!category) {
        return (
            <span className="text-xs text-text-muted italic">
                Chưa phân loại
            </span>
        )
    }

    // Lookup icon động từ lucide-react
    const iconName = toPascalCase(category.icon)
    // @ts-expect-error — dynamic icon access
    const IconComponent = Icons[iconName] || Icons.Tag

    const iconSize = size === 'sm' ? 12 : 14
    const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1'
    const fontSize = size === 'sm' ? 'text-xs' : 'text-sm'

    return (
        <span
            className={`
        inline-flex items-center gap-1.5
        rounded-full font-medium
        ${padding} ${fontSize}
      `}
            style={{
                backgroundColor: `${category.color}15`,  // 15 = ~8% opacity
                color: category.color,
            }}
        >
            <IconComponent size={iconSize} />
            {showName && category.name}
        </span>
    )
}