'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import Header from '@/components/Header'
import TransactionItem from '@/components/TransactionItem'
import { useUser } from '@/contexts/UserContext'
import dayjs from 'dayjs'

interface Transaction {
  id: number
  type: string
  amount: number
  category: string
  date: string
  note?: string
}

interface Stats {
  income: number
  expense: number
  balance: number
}

export default function HomePage() {
  const { currentUser } = useUser()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<Stats>({ income: 0, expense: 0, balance: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      fetchData(currentUser.id)
    }
  }, [currentUser])

  const fetchData = async (userId: number) => {
    try {
      // Fetch transactions
      const transRes = await fetch(`/api/transactions?userId=${userId}`)
      const transData = await transRes.json()
      if (transData.success) {
        setTransactions(transData.data.slice(0, 10))
      }

      // Fetch stats
      const statsRes = await fetch(`/api/transactions/stats?userId=${userId}`)
      const statsData = await statsRes.json()
      if (statsData.success) {
        setStats(statsData.data)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="记账本" />

      <main className="px-4 py-6 max-w-[480px] mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
            <div className="text-xs text-gray-400 mb-1">收入</div>
            <div className="text-lg font-bold text-income truncate">
              ¥{stats.income.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
            <div className="text-xs text-gray-400 mb-1">支出</div>
            <div className="text-lg font-bold text-expense truncate">
              ¥{stats.expense.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
            <div className="text-xs text-gray-400 mb-1">结余</div>
            <div className={`text-lg font-bold truncate ${stats.balance >= 0 ? 'text-primary' : 'text-expense'}`}>
              ¥{stats.balance.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Month selector */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {dayjs().format('YYYY年MM月')}
          </h2>
          <Link
            href="/add"
            className="flex items-center gap-1 text-primary text-sm font-medium"
          >
            <Plus size={16} />
            记一笔
          </Link>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10 text-gray-400">加载中...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-400">暂无记录</p>
              <p className="text-gray-400 text-sm">点击右上角开始记账</p>
            </div>
          ) : (
            transactions.map((trans) => (
              <TransactionItem key={trans.id} transaction={trans} />
            ))
          )}
        </div>
      </main>

      {/* FAB */}
      <Link
        href="/add"
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all active:scale-95"
      >
        <Plus size={28} />
      </Link>
    </div>
  )
}
