import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import dayjs from 'dayjs'

// GET /api/transactions/stats - 获取统计数据
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get('month') || dayjs().format('YYYY-MM')

    const startDate = `${month}-01`
    const endDate = dayjs(startDate).endOf('month').format('YYYY-MM-DD')

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
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

    // Last 7 days trend
    const last7Days: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
      last7Days[date] = 0
    }

    data
      .filter((t: any) => t.type === 'expense' && last7Days[t.date] !== undefined)
      .forEach((t: any) => {
        last7Days[t.date] += parseFloat(t.amount)
      })

    const trend = Object.entries(last7Days).map(([date, amount]) => ({
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
        trend,
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
