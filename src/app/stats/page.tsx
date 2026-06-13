'use client'

import { useEffect, useState, useMemo } from 'react'
import Header from '@/components/Header'
import StatsPieChart from '@/components/StatsPieChart'
import StatsLineChart from '@/components/StatsLineChart'
import CalendarPicker from '@/components/CalendarPicker'
import { getCategoryById } from '@/lib/categories'
import { useUser } from '@/contexts/UserContext'
import { Calendar } from 'lucide-react'
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
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'))
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [pickStartDate, setPickStartDate] = useState(true)

  useEffect(() => {
    if (currentUser) {
      fetchStats(currentUser.id, startDate, endDate)
    }
  }, [currentUser, startDate, endDate])

  const fetchStats = async (userId: number, start: string, end: string) => {
    setLoading(true)
    try {
      const cacheKey = `stats_${userId}_${start}_${end}`
      const cached = localStorage.getItem(cacheKey)
      
      if (cached) {
        // 使用缓存数据，提高首屏加载速度
        setStats(JSON.parse(cached))
      }

      // 并行请求最新数据
      const res = await fetch(`/api/transactions/stats?userId=${userId}&startDate=${start}&endDate=${end}`)
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

  const handleQuickSelect = (days: number) => {
    const end = dayjs().format('YYYY-MM-DD')
    const start = dayjs().subtract(days - 1, 'day').format('YYYY-MM-DD')
    setStartDate(start)
    setEndDate(end)
    setShowDatePicker(false)
  }

  const handleThisMonth = () => {
    setStartDate(dayjs().startOf('month').format('YYYY-MM-DD'))
    setEndDate(dayjs().endOf('month').format('YYYY-MM-DD'))
    setShowDatePicker(false)
  }

  const handleLastMonth = () => {
    const lastMonth = dayjs().subtract(1, 'month')
    setStartDate(lastMonth.startOf('month').format('YYYY-MM-DD'))
    setEndDate(lastMonth.endOf('month').format('YYYY-MM-DD'))
    setShowDatePicker(false)
  }

  const dateRangeText = `${dayjs(startDate).format('MM月DD日')} - ${dayjs(endDate).format('MM月DD日')}`

  return (
    <div className="min-h-screen">
      <Header title="统计" />

      <main className="px-4 py-6 max-w-[480px] mx-auto">
        {/* Date Range Selector */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl shadow-sm mb-6 border border-indigo-100">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full flex items-center justify-between py-1"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <Calendar size={20} className="text-indigo-500" />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-400">统计区间</div>
                <div className="font-bold text-gray-800">{dateRangeText}</div>
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-300 ${showDatePicker ? 'rotate-180' : ''}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </button>

          {/* Date Picker Dropdown */}
          {showDatePicker && (
            <div className="mt-4 pt-4 border-t border-indigo-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
              {/* Quick Select Buttons */}
              <div>
                <div className="text-xs text-gray-400 mb-2">快速选择</div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '近7天', days: 7 },
                    { label: '近30天', days: 30 },
                    { label: '本月', action: 'thisMonth' },
                    { label: '上月', action: 'lastMonth' },
                  ].map((item) => {
                    const isActive =
                      (item.days && dayjs().diff(dayjs(startDate), 'day') + 1 === item.days && endDate === dayjs().format('YYYY-MM-DD')) ||
                      (item.action === 'thisMonth' && startDate === dayjs().startOf('month').format('YYYY-MM-DD')) ||
                      (item.action === 'lastMonth' && startDate === dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'))
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          if (item.days) handleQuickSelect(item.days)
                          else if (item.action === 'thisMonth') handleThisMonth()
                          else if (item.action === 'lastMonth') handleLastMonth()
                        }}
                        className={`py-2.5 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200'
                            : 'bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                      >
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Date Range */}
              <div>
                <div className="text-xs text-gray-400 mb-2">自定义区间</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPickStartDate(true)}
                    className={`flex-1 p-3 bg-white rounded-xl text-sm border transition-all ${
                      pickStartDate ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-xs text-gray-400">开始日期</div>
                    <div className="text-gray-700 font-medium">
                      {startDate ? dayjs(startDate).format('YYYY-MM-DD') : '选择日期'}
                    </div>
                  </button>
                  <div className="w-8 h-px bg-gray-300"></div>
                  <button
                    onClick={() => setPickStartDate(false)}
                    className={`flex-1 p-3 bg-white rounded-xl text-sm border transition-all ${
                      !pickStartDate ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-xs text-gray-400">结束日期</div>
                    <div className="text-gray-700 font-medium">
                      {endDate ? dayjs(endDate).format('YYYY-MM-DD') : '选择日期'}
                    </div>
                  </button>
                </div>

                {/* Custom Calendar Picker */}
                <div className="mt-3">
                  <CalendarPicker
                    value={pickStartDate ? startDate : endDate}
                    onChange={(date) => {
                      if (pickStartDate) {
                        setStartDate(date)
                      } else {
                        setEndDate(date)
                      }
                    }}
                  />
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={() => setShowDatePicker(false)}
                className="w-full py-3 bg-indigo-500 text-white rounded-xl font-medium shadow-md shadow-indigo-200 hover:bg-indigo-600 active:scale-[0.98] transition-all"
              >
                确定
              </button>
            </div>
          )}
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
