import { getCategoryById } from '@/lib/categories'

interface CategoryIconProps {
  categoryId: string
  size?: 'sm' | 'md' | 'lg'
}

export default function CategoryIcon({ categoryId, size = 'md' }: CategoryIconProps) {
  const category = getCategoryById(categoryId)
  const sizeMap = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  return (
    <span
      className={`${sizeMap[size]} flex items-center justify-center`}
      style={{ color: category.color }}
    >
      {category.icon}
    </span>
  )
}
