'use client'

import { useState, useRef, useCallback } from 'react'
import { ChevronRight, Trash2 } from 'lucide-react'
import CategoryIcon from './CategoryIcon'
import { getCategoryById } from '@/lib/categories'
import dayjs from 'dayjs'

interface TransactionItemProps {
  transaction: {
    id: number
    type: string
    amount: number
    category: string
    date: string
    note?: string
  }
  onDelete: (id: number) => void
}

export default function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const currentXRef = useRef(0)

  const category = getCategoryById(transaction.category)
  const isIncome = transaction.type === 'income'
  const maxSwipe = 100 // 最大滑动距离

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
    currentXRef.current = translateX
    setIsDragging(true)
  }, [translateX])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return
    
    const diff = e.touches[0].clientX - startXRef.current
    let newTranslateX = currentXRef.current + diff
    
    // 限制滑动范围
    if (newTranslateX > 0) newTranslateX = 0
    if (newTranslateX < -maxSwipe) newTranslateX = -maxSwipe
    
    setTranslateX(newTranslateX)
  }, [isDragging])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    
    // 如果滑动超过一半，显示删除按钮
    if (translateX < -maxSwipe / 2) {
      setTranslateX(-maxSwipe)
    } else {
      setTranslateX(0)
    }
  }, [translateX])

  const handleDelete = () => {
    if (confirm('确定删除这条记录吗？')) {
      onDelete(transaction.id)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-sm">
      {/* 删除按钮 */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-24 bg-expense flex items-center justify-center"
        style={{ transform: `translateX(${Math.min(-translateX, 0)}px)` }}
      >
        <button
          onClick={handleDelete}
          className="flex flex-col items-center text-white"
        >
          <Trash2 size={20} />
          <span className="text-xs mt-1">删除</span>
        </button>
      </div>

      {/* 主内容 */}
      <div
        className="relative flex items-center p-4 bg-white rounded-2xl hover:shadow-md transition-all"
        style={{ 
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50">
          <CategoryIcon categoryId={transaction.category} size="md" />
        </div>

        <div className="flex-1 ml-3">
          <div className="font-medium">{category.name}</div>
          <div className="text-sm text-gray-400">
            {dayjs(transaction.date).format('MM月DD日')} · {transaction.note || '无备注'}
          </div>
        </div>

        <div className="flex items-center">
          <span className={`text-lg font-semibold ${isIncome ? 'text-income' : 'text-expense'}`}>
            {isIncome ? '+' : '-'}{transaction.amount.toFixed(2)}
          </span>
          <ChevronRight size={18} className="ml-2 text-gray-300" />
        </div>
      </div>
    </div>
  )
}
