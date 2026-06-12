'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
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
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const category = getCategoryById(transaction.category)
  const isIncome = transaction.type === 'income'

  return (
    <Link
      href={`/edit/${transaction.id}`}
      className="flex items-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all"
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
    </Link>
  )
}
