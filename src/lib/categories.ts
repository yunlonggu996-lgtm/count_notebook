export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export const categories: Category[] = [
  { id: 'food', name: '餐饮', icon: '🍜', color: '#F59E0B' },
  { id: 'transport', name: '交通', icon: '🚗', color: '#3B82F6' },
  { id: 'shopping', name: '购物', icon: '🛒', color: '#EC4899' },
  { id: 'living', name: '居住', icon: '🏠', color: '#8B5CF6' },
  { id: 'entertainment', name: '娱乐', icon: '🎮', color: '#10B981' },
  { id: 'medical', name: '医疗', icon: '💊', color: '#EF4444' },
  { id: 'salary', name: '工资', icon: '💰', color: '#4F46E5' },
  { id: 'other', name: '其他', icon: '📦', color: '#6B7280' },
]

export const getCategoryById = (id: string): Category => {
  return categories.find(c => c.id === id) || categories[7]
}
