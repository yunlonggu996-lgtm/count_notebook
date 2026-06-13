'use client'

import { useEffect, useState, useMemo } from 'react'
import Header from '@/components/Header'
import StatsPieChart from '@/components/StatsPieChart'
import StatsLineChart from '@/components/StatsLineChart'
import { getCategoryById } from '@/lib/categories'
import { useUser } from '@/contexts/UserContext'
import dayjs from 'dayjs'

interface StatsData {
  income: number
  expense: number
  balance: number
  categoryBreakdown: Record<string, number>
  trend: Array<{ date: string; amount: number }>
}

export default function StatsPage() {
  const { currentUser } = useUser()
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      fetchStats(currentUser.id)
    }
  }, [currentUser])

  const fetchStats = async (userId: number) => {
    setLoading(true)
    try {
      const cacheKey = `stats_${userId}_${dayjs().format('YYYY-MM')}`
      const cached = localStorage.getItem(cacheKey)
      
      if (cached) {
        // 使用缓存数据，提高首屏加载速度
        setStats(JSON.parse(cached))
      }

      // 并行请求最新数据
      const res = await fetch(`/api/transactions/stats?userId=${userId}`)
      const data = await res.json()
      
      if (data.success) {
        setStats(data.data)
        // 更新缓存
        localStorage.setItem(cacheKey, JSON.stringify(data.data))
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // 使用 useMemo 缓存计算结果，避免不必要的重计算
  const categoryList = useMemo(() => {
    if (!stats) return []
    return Object.entries(stats.categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .map(([catId, amount]) => ({
        catId,
        amount,
        category: getCategoryById(catId),
        percentage: stats.expense > 0 ? ((amount / stats.expense) * 100).toFixed(1) : '0',
      }))
  }, [stats])

  return (
    <div className="min-h-screen">
      <Header title="统计" />

      <main className="px-4 py-6 max-w-[480px] mx-auto">
        {/* Month display */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold">
            {dayjs().format('YYYY年MM月')}
          </h2>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
            <div className="text-xs text-gray-400 mb-1">收入</div>
            <div className="text-base font-bold text-income truncate">
              ¥{stats?.income.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
            <div className="text-xs text-gray-400 mb-1">支出</div>
            <div className="text-base font-bold text-expense truncate">
              ¥{stats?.expense.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
            <div className="text-xs text-gray-400 mb-1">结余</div>
            <div className={`text-base font-bold truncate ${(stats?.balance || 0) >= 0 ? 'text-primary' : 'text-expense'}`}>
              ¥{stats?.balance.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">加载中...</div>
        ) : (
          <>
            {/* Pie Chart */}
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
              <div className="text-sm text-gray-400 mb-2">支出分类</div>
              <StatsPieChart data={stats?.categoryBreakdown || {}} />
            </div>

            {/* Line Chart */}
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
              <div className="text-sm text-gray-400 mb-2">近7天支出趋势</div>
              <StatsLineChart data={stats?.trend || []} />
            </div>

            {/* Category List */}
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <div className="text-sm text-gray-400 mb-4">分类明细</div>
              <div className="space-y-3">
                {categoryList.length > 0 ? (
                  categoryList.map(({ catId, amount, category, percentage }) => (
                    <div key={catId} className="flex items-center">
                      <span className="text-2xl mr-3">{category.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-expense">¥{amount.toFixed(2)}</span>
                        </div>
                        <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: category.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400">暂无数据</div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
