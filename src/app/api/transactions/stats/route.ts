import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import dayjs from 'dayjs'

// GET /api/transactions/stats - 获取统计数据
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const searchParams = request.nextUrl.searchParams
    const userId = parseInt(searchParams.get('userId') || '1')
    
    // 支持两种参数：month 或 startDate/endDate
    const month = searchParams.get('month')
    let startDate: string
    let endDate: string
    
    if (month) {
      // 按月查询
      startDate = `${month}-01`
      endDate = dayjs(startDate).endOf('month').format('YYYY-MM-DD')
    } else {
      // 按区间查询
      startDate = searchParams.get('startDate') || dayjs().startOf('month').format('YYYY-MM-DD')
      endDate = searchParams.get('endDate') || dayjs().endOf('month').format('YYYY-MM-DD')
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)

    if (error) {
      console.error('Failed to fetch stats:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // Calculate totals
    const income = data
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0)

    const expense = data
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0)

    // Category breakdown for expenses
    const categoryBreakdown: Record<string, number> = {}
    data
      .filter((t: any) => t.type === 'expense')
      .forEach((t: any) => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + parseFloat(t.amount)
      })

    // Last 7 days trend (or based on actual date range)
    const days = dayjs(endDate).diff(dayjs(startDate), 'day') + 1
    const trendDays = Math.min(days, 7) // 最多显示7天
    
    const trend: Record<string, number> = {}
    for (let i = trendDays - 1; i >= 0; i--) {
      const date = dayjs(endDate).subtract(i, 'day').format('YYYY-MM-DD')
      trend[date] = 0
    }

    data
      .filter((t: any) => t.type === 'expense' && trend[t.date] !== undefined)
      .forEach((t: any) => {
        trend[t.date] += parseFloat(t.amount)
      })

    const trendData = Object.entries(trend).map(([date, amount]) => ({
      date: dayjs(date).format('MM-DD'),
      amount,
    }))

    return NextResponse.json({
      success: true,
      data: {
        income,
        expense,
        balance: income - expense,
        categoryBreakdown,
        trend: trendData,
      },
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
